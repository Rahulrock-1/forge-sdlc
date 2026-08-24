/**
 * Forge SDLC - LLM & Token Model Configuration Types
 */

export type ModelVendor =
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'deepseek'
  | 'openrouter'
  | 'ollama'
  | 'custom';

export interface LLMConfig {
  vendor?: ModelVendor;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
}

export interface ModelPreset {
  id: string;
  displayName: string;
  vendor: ModelVendor;
  defaultModel: string;
  envKeyName: string;
  defaultBaseUrl?: string;
}

export const POPULAR_MODELS: ModelPreset[] = [
  { id: 'claude-3-7-sonnet', displayName: 'Anthropic Claude 3.7 Sonnet', vendor: 'anthropic', defaultModel: 'claude-3-7-sonnet-20250219', envKeyName: 'ANTHROPIC_API_KEY' },
  { id: 'claude-3-5-sonnet', displayName: 'Anthropic Claude 3.5 Sonnet', vendor: 'anthropic', defaultModel: 'claude-3-5-sonnet-20241022', envKeyName: 'ANTHROPIC_API_KEY' },
  { id: 'gpt-4o', displayName: 'OpenAI GPT-4o', vendor: 'openai', defaultModel: 'gpt-4o', envKeyName: 'OPENAI_API_KEY' },
  { id: 'o3-mini', displayName: 'OpenAI o3-mini (Reasoning)', vendor: 'openai', defaultModel: 'o3-mini', envKeyName: 'OPENAI_API_KEY' },
  { id: 'gemini-2.0-flash', displayName: 'Google Gemini 2.0 Flash', vendor: 'gemini', defaultModel: 'gemini-2.0-flash', envKeyName: 'GEMINI_API_KEY' },
  { id: 'gemini-2.5-pro', displayName: 'Google Gemini 2.5 Pro', vendor: 'gemini', defaultModel: 'gemini-2.5-pro', envKeyName: 'GEMINI_API_KEY' },
  { id: 'deepseek-chat', displayName: 'DeepSeek V3 (deepseek-chat)', vendor: 'deepseek', defaultModel: 'deepseek-chat', envKeyName: 'DEEPSEEK_API_KEY' },
  { id: 'deepseek-reasoner', displayName: 'DeepSeek R1 (deepseek-reasoner)', vendor: 'deepseek', defaultModel: 'deepseek-reasoner', envKeyName: 'DEEPSEEK_API_KEY' },
  { id: 'openrouter', displayName: 'OpenRouter Universal Gateway', vendor: 'openrouter', defaultModel: 'anthropic/claude-3.7-sonnet', envKeyName: 'OPENROUTER_API_KEY', defaultBaseUrl: 'https://openrouter.ai/api/v1' },
  { id: 'ollama', displayName: 'Ollama Local Models (e.g. llama3.3, qwen2.5)', vendor: 'ollama', defaultModel: 'llama3.3', envKeyName: 'OLLAMA_HOST', defaultBaseUrl: 'http://localhost:11434/v1' },
];
