/**
 * Cached microcompact configuration — provides quick access to the
 * microcompact config without re-reading from disk on every query.
 * Feature-gated behind CACHED_MICROCOMPACT.
 *
 * Reconstructed from caller context in constants/prompts.ts, api/claude.ts,
 * and microCompact.ts. See also cachedMicrocompact.ts for the full state.
 */

import { feature } from '../../environment-runner/feature.js'

let cachedConfig: any = null

/**
 * Get the cached microcompact configuration. Returns null if not yet
 * initialized or if the feature is disabled.
 *
 * Used by prompts.ts for FRC (first-response caching) and by claude.ts
 * for API request construction.
 */
export function getCachedMCConfig(): any {
  if (!feature('CACHED_MICROCOMPACT')) return null
  return cachedConfig
}

/**
 * Update the cached microcompact configuration.
 */
export function setCachedMCConfig(config: any): void {
  cachedConfig = config
}
