/**
 * Attribution hooks — registers PostToolUse callback hooks that track file
 * content changes for commit attribution (claude vs human authorship).
 *
 * Reconstructed from caller context in hooks.ts, postCompactCleanup.ts,
 * and commitAttribution.ts.
 */

import { feature } from '../environment-runner/feature.js'

// Module-level caches for file content snapshots used by the attribution
// system. sweepFileContentCache evicts stale entries after compaction.
const fileContentCache = new Map<string, string>()

/**
 * Register PostToolUse callback hooks that snapshot file content before/after
 * edits. Called once during session init when COMMIT_ATTRIBUTION is enabled.
 *
 * The hooks are internal callbacks (type 'callback') — they run in the
 * fast-path of hooks.ts (no span/progress/abort overhead).
 */
export function registerAttributionHooks(): void {
  if (!feature('COMMIT_ATTRIBUTION')) return
  // In the full implementation, this registers PostToolUse hooks via
  // addInternalHooks() that capture file content diffs for attribution.
  // The hooks update the AttributionState tracked in commitAttribution.ts.
}

/**
 * Clear all attribution caches (file snapshots, baseline states).
 * Called when the session is reset or on explicit cache invalidation.
 */
export function clearAttributionCaches(): void {
  fileContentCache.clear()
}

/**
 * Evict stale entries from the file content cache. Called after compaction
 * to free memory from files that are no longer actively being edited.
 */
export function sweepFileContentCache(): void {
  // In the full implementation, this walks the cache and evicts entries
  // for files not referenced in the recent conversation window.
  // After compaction, many file snapshots become stale.
  fileContentCache.clear()
}
