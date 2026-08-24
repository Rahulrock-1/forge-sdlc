/**
 * Forge SDLC - Authentication & Token Verification Engine
 */

import { LLMConfig, ModelVendor } from '../types/model.js';
import { LLMManager } from './llm.js';

export interface AuthValidationResult {
  valid: boolean;
  vendor: ModelVendor;
  model: string;
  statusCode?: number;
  latencyMs: number;
  message: string;
  accountInfo?: {
    organization?: string;
    availableModels?: string[];
  };
}

export class AuthManager {
  /**
   * Ping and authenticate active token against the target provider's live endpoint
   */
  public static async validateToken(config?: LLMConfig, workspaceRoot: string = process.cwd()): Promise<AuthValidationResult> {
    const resolved = config || LLMManager.resolveConfig(workspaceRoot);

    if (!resolved.apiKey && resolved.vendor !== 'ollama') {
      return {
        valid: false,
        vendor: resolved.vendor || 'custom',
        model: resolved.model || 'none',
        latencyMs: 0,
        message: 'No API key or token found. Set a token via "npx forge config set token <key>" or export OPENAI_API_KEY / ANTHROPIC_API_KEY.',
      };
    }

    const startTime = Date.now();

    try {
      if (resolved.vendor === 'anthropic') {
        return await this.validateAnthropic(resolved, startTime);
      } else if (resolved.vendor === 'gemini') {
        return await this.validateGemini(resolved, startTime);
      } else if (resolved.vendor === 'ollama') {
        return await this.validateOllama(resolved, startTime);
      } else {
        // OpenAI, DeepSeek, OpenRouter, Custom
        return await this.validateOpenAICompatible(resolved, startTime);
      }
    } catch (err: any) {
      return {
        valid: false,
        vendor: resolved.vendor || 'openai',
        model: resolved.model || 'gpt-4o',
        latencyMs: Date.now() - startTime,
        message: `Network or Connection Error: ${err.message || String(err)}`,
      };
    }
  }

  private static async validateAnthropic(config: LLMConfig, startTime: number): Promise<AuthValidationResult> {
    const url = config.baseUrl ? `${config.baseUrl.replace(/\/+$/, '')}/messages` : 'https://api.anthropic.com/v1/messages';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model || 'claude-3-7-sonnet-20250219',
          max_tokens: 5,
          messages: [{ role: 'user', content: 'ping' }],
        }),
      });

      const latencyMs = Date.now() - startTime;

      if (res.status === 200) {
        return {
          valid: true,
          vendor: 'anthropic',
          model: config.model || 'claude-3-7-sonnet-20250219',
          statusCode: 200,
          latencyMs,
          message: 'Authenticated successfully with Anthropic API.',
        };
      } else if (res.status === 401) {
        return {
          valid: false,
          vendor: 'anthropic',
          model: config.model || 'claude',
          statusCode: 401,
          latencyMs,
          message: 'Invalid Anthropic API Key (401 Unauthorized). Check your ANTHROPIC_API_KEY token.',
        };
      } else if (res.status === 429) {
        return {
          valid: false,
          vendor: 'anthropic',
          model: config.model || 'claude',
          statusCode: 429,
          latencyMs,
          message: 'Rate limit or Quota exceeded (429 Too Many Requests). Check your Anthropic billing credits.',
        };
      } else {
        const text = await res.text();
        return {
          valid: false,
          vendor: 'anthropic',
          model: config.model || 'claude',
          statusCode: res.status,
          latencyMs,
          message: `Anthropic returned HTTP ${res.status}: ${text.slice(0, 150)}`,
        };
      }
    } catch (err: any) {
      return {
        valid: false,
        vendor: 'anthropic',
        model: config.model || 'claude',
        latencyMs: Date.now() - startTime,
        message: `Failed to reach Anthropic endpoint: ${err.message}`,
      };
    }
  }

  private static async validateOpenAICompatible(config: LLMConfig, startTime: number): Promise<AuthValidationResult> {
    const baseUrl = config.baseUrl ? config.baseUrl.replace(/\/+$/, '') : 'https://api.openai.com/v1';
    const url = `${baseUrl}/models`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      });

      const latencyMs = Date.now() - startTime;

      if (res.status === 200) {
        const data = (await res.json()) as any;
        const availableModels = data.data?.slice(0, 5).map((m: any) => m.id) || [];
        return {
          valid: true,
          vendor: config.vendor || 'openai',
          model: config.model || 'gpt-4o',
          statusCode: 200,
          latencyMs,
          message: `Authenticated successfully with ${config.vendor?.toUpperCase() || 'OpenAI'} API!`,
          accountInfo: {
            availableModels,
          },
        };
      } else if (res.status === 401) {
        return {
          valid: false,
          vendor: config.vendor || 'openai',
          model: config.model || 'gpt-4o',
          statusCode: 401,
          latencyMs,
          message: `Invalid ${config.vendor?.toUpperCase() || 'OpenAI'} API Key (401 Unauthorized).`,
        };
      } else if (res.status === 429) {
        return {
          valid: false,
          vendor: config.vendor || 'openai',
          model: config.model || 'gpt-4o',
          statusCode: 429,
          latencyMs,
          message: 'Rate limit or Quota exceeded (429). Check your API credits.',
        };
      } else {
        const text = await res.text();
        return {
          valid: false,
          vendor: config.vendor || 'openai',
          model: config.model || 'gpt-4o',
          statusCode: res.status,
          latencyMs,
          message: `Endpoint returned HTTP ${res.status}: ${text.slice(0, 150)}`,
        };
      }
    } catch (err: any) {
      return {
        valid: false,
        vendor: config.vendor || 'openai',
        model: config.model || 'gpt-4o',
        latencyMs: Date.now() - startTime,
        message: `Connection failed: ${err.message}`,
      };
    }
  }

  private static async validateGemini(config: LLMConfig, startTime: number): Promise<AuthValidationResult> {
    const key = config.apiKey;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
      const res = await fetch(url);
      const latencyMs = Date.now() - startTime;

      if (res.status === 200) {
        return {
          valid: true,
          vendor: 'gemini',
          model: config.model || 'gemini-2.0-flash',
          statusCode: 200,
          latencyMs,
          message: 'Authenticated successfully with Google Gemini API!',
        };
      } else {
        return {
          valid: false,
          vendor: 'gemini',
          model: config.model || 'gemini-2.0-flash',
          statusCode: res.status,
          latencyMs,
          message: `Invalid Google Gemini API Key (HTTP ${res.status}).`,
        };
      }
    } catch (err: any) {
      return {
        valid: false,
        vendor: 'gemini',
        model: config.model || 'gemini-2.0-flash',
        latencyMs: Date.now() - startTime,
        message: `Gemini connection failed: ${err.message}`,
      };
    }
  }

  private static async validateOllama(config: LLMConfig, startTime: number): Promise<AuthValidationResult> {
    const baseUrl = config.baseUrl ? config.baseUrl.replace(/\/+$/, '') : 'http://localhost:11434';
    const url = `${baseUrl}/api/tags`;

    try {
      const res = await fetch(url);
      const latencyMs = Date.now() - startTime;

      if (res.status === 200) {
        const data = (await res.json()) as any;
        const models = data.models?.map((m: any) => m.name) || [];
        return {
          valid: true,
          vendor: 'ollama',
          model: config.model || 'llama3.3',
          statusCode: 200,
          latencyMs,
          message: 'Connected successfully to local Ollama server!',
          accountInfo: {
            availableModels: models,
          },
        };
      } else {
        return {
          valid: false,
          vendor: 'ollama',
          model: config.model || 'llama3.3',
          statusCode: res.status,
          latencyMs,
          message: `Ollama returned HTTP ${res.status}.`,
        };
      }
    } catch (err: any) {
      return {
        valid: false,
        vendor: 'ollama',
        model: config.model || 'llama3.3',
        latencyMs: Date.now() - startTime,
        message: `Could not connect to local Ollama server at ${baseUrl}. Ensure Ollama is running.`,
      };
    }
  }
}
