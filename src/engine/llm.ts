/**
 * Forge SDLC - Universal LLM & Token Manager
 * Handles multi-vendor model calling, token authorization, and fallback generation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { LLMConfig, ModelVendor, POPULAR_MODELS } from '../types/model.js';

export interface LLMResponse {
  content: string;
  modelUsed: string;
  vendor: ModelVendor;
  tokensUsed?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class LLMManager {
  /**
   * Resolve active LLM configuration from CLI flags, env vars, .env files, and .forgerc.json
   */
  public static resolveConfig(
    workspaceRoot: string = process.cwd(),
    cliOverrides: Partial<LLMConfig> = {}
  ): LLMConfig {
    // 1. Check .env in workspace root
    this.loadDotEnv(workspaceRoot);

    // 2. Detect configured vendor and key from environment
    let vendor: ModelVendor = 'custom';
    let apiKey: string | undefined = undefined;
    let model: string = 'gpt-4o';
    let baseUrl: string | undefined = undefined;

    if (process.env.ANTHROPIC_API_KEY) {
      vendor = 'anthropic';
      apiKey = process.env.ANTHROPIC_API_KEY;
      model = 'claude-3-7-sonnet-20250219';
    } else if (process.env.OPENAI_API_KEY) {
      vendor = 'openai';
      apiKey = process.env.OPENAI_API_KEY;
      model = 'gpt-4o';
    } else if (process.env.GEMINI_API_KEY) {
      vendor = 'gemini';
      apiKey = process.env.GEMINI_API_KEY;
      model = 'gemini-2.0-flash';
    } else if (process.env.DEEPSEEK_API_KEY) {
      vendor = 'deepseek';
      apiKey = process.env.DEEPSEEK_API_KEY;
      model = 'deepseek-chat';
      baseUrl = 'https://api.deepseek.com/v1';
    } else if (process.env.OPENROUTER_API_KEY) {
      vendor = 'openrouter';
      apiKey = process.env.OPENROUTER_API_KEY;
      model = 'anthropic/claude-3.7-sonnet';
      baseUrl = 'https://openrouter.ai/api/v1';
    } else if (process.env.OLLAMA_HOST || process.env.USE_OLLAMA) {
      vendor = 'ollama';
      model = 'llama3.3';
      baseUrl = process.env.OLLAMA_HOST || 'http://localhost:11434/v1';
    }

    // 3. Load from .forgerc.json if present
    const configPath = path.join(workspaceRoot, '.forgerc.json');
    if (fs.existsSync(configPath)) {
      try {
        const fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (fileConfig.llm) {
          if (fileConfig.llm.vendor) vendor = fileConfig.llm.vendor;
          if (fileConfig.llm.model) model = fileConfig.llm.model;
          if (fileConfig.llm.apiKey) apiKey = fileConfig.llm.apiKey;
          if (fileConfig.llm.baseUrl) baseUrl = fileConfig.llm.baseUrl;
        }
      } catch {
        // Ignore
      }
    }

    // 4. Apply CLI overrides
    return {
      vendor: cliOverrides.vendor || vendor,
      model: cliOverrides.model || model,
      apiKey: cliOverrides.apiKey || apiKey,
      baseUrl: cliOverrides.baseUrl || baseUrl,
      temperature: cliOverrides.temperature ?? 0.2,
      maxTokens: cliOverrides.maxTokens ?? 4096,
    };
  }

  /**
   * Execute prompt against configured LLM or fallback cleanly
   */
  public static async generate(
    systemPrompt: string,
    userPrompt: string,
    config: LLMConfig
  ): Promise<LLMResponse | null> {
    if (!config.apiKey && config.vendor !== 'ollama') {
      // No API key provided, caller will use high-fidelity template engine
      return null;
    }

    try {
      if (config.vendor === 'anthropic') {
        return await this.callAnthropic(systemPrompt, userPrompt, config);
      } else {
        // Standard OpenAI-compatible (OpenAI, Gemini OpenAI-compatible, DeepSeek, OpenRouter, Ollama)
        return await this.callOpenAICompatible(systemPrompt, userPrompt, config);
      }
    } catch (err: any) {
      // Graceful fallback to deterministic engine
      return null;
    }
  }

  private static async callOpenAICompatible(
    systemPrompt: string,
    userPrompt: string,
    config: LLMConfig
  ): Promise<LLMResponse> {
    const url = config.baseUrl ? `${config.baseUrl.replace(/\/+$/, '')}/chat/completions` : 'https://api.openai.com/v1/chat/completions';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    const body = {
      model: config.model || 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: config.temperature ?? 0.2,
      max_tokens: config.maxTokens ?? 4096,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`LLM call failed with status ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as any;
    const content = data.choices?.[0]?.message?.content || '';

    return {
      content,
      modelUsed: data.model || config.model || 'unknown',
      vendor: config.vendor || 'openai',
      tokensUsed: data.usage ? {
        promptTokens: data.usage.prompt_tokens || 0,
        completionTokens: data.usage.completion_tokens || 0,
        totalTokens: data.usage.total_tokens || 0,
      } : undefined,
    };
  }

  private static async callAnthropic(
    systemPrompt: string,
    userPrompt: string,
    config: LLMConfig
  ): Promise<LLMResponse> {
    const url = config.baseUrl ? `${config.baseUrl.replace(/\/+$/, '')}/messages` : 'https://api.anthropic.com/v1/messages';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey || '',
      'anthropic-version': '2023-06-01',
    };

    const body = {
      model: config.model || 'claude-3-7-sonnet-20250219',
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
      max_tokens: config.maxTokens ?? 4096,
      temperature: config.temperature ?? 0.2,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Anthropic call failed with status ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as any;
    const content = data.content?.[0]?.text || '';

    return {
      content,
      modelUsed: data.model || config.model || 'claude',
      vendor: 'anthropic',
      tokensUsed: data.usage ? {
        promptTokens: data.usage.input_tokens || 0,
        completionTokens: data.usage.output_tokens || 0,
        totalTokens: (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0),
      } : undefined,
    };
  }

  private static loadDotEnv(workspaceRoot: string): void {
    const envPaths = [
      path.join(workspaceRoot, '.env'),
      path.join(workspaceRoot, '.env.local'),
    ];

    for (const envPath of envPaths) {
      if (fs.existsSync(envPath)) {
        try {
          const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
              const [key, ...vals] = trimmed.split('=');
              const val = vals.join('=').trim().replace(/^["']|["']$/g, '');
              if (key && !process.env[key.trim()]) {
                process.env[key.trim()] = val;
              }
            }
          }
        } catch {
          // Ignore
        }
      }
    }
  }
}
