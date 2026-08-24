/**
 * Forge SDLC - Provider Registry
 */

import { IProviderAdapter, ProviderMetadata } from '../types/provider.js';
import { BmadProvider } from './bmad.js';
import { SpecKitProvider } from './speckit.js';
import { InternalProvider } from './internal.js';

export class ProviderRegistry {
  private static instance: ProviderRegistry;
  private providers: Map<string, IProviderAdapter> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  private registerDefaults(): void {
    this.register(new BmadProvider());
    this.register(new SpecKitProvider());
    this.register(new InternalProvider());
  }

  public register(provider: IProviderAdapter): void {
    this.providers.set(provider.metadata.id.toLowerCase(), provider);
  }

  public get(providerId: string): IProviderAdapter | undefined {
    return this.providers.get(providerId.toLowerCase());
  }

  public getAll(): IProviderAdapter[] {
    return Array.from(this.providers.values());
  }

  public getAllMetadata(): ProviderMetadata[] {
    return this.getAll().map((p) => p.metadata);
  }

  /**
   * Find all registered providers that support the given capability
   */
  public findProvidersForCapability(capabilityId: string): IProviderAdapter[] {
    return this.getAll().filter((provider) => provider.supports(capabilityId));
  }
}
