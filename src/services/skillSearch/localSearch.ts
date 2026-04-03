/**
 * Local skill index cache — maintains an in-memory index of discovered
 * skills for fast search. Cache is invalidated when MCP connections change.
 *
 * Reconstructed from caller context in useManageMCPConnections.ts and commands.ts.
 */

let indexCache: Map<string, any> | null = null

/**
 * Clear the in-memory skill index cache. Called when MCP connections change
 * (connect/disconnect/reconnect) to force re-indexing of available skills.
 */
export function clearSkillIndexCache(): void {
  indexCache?.clear()
  indexCache = null
}
