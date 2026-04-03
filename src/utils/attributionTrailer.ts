/**
 * Build git trailer lines for PR descriptions that survive squash merges.
 * Contains internal model/attribution strings excluded from external builds
 * via tree-shaking (dynamic import behind feature('COMMIT_ATTRIBUTION')).
 *
 * Reconstructed from caller context in attribution.ts and commitAttribution.ts.
 */

import type { AttributionData, AttributionState } from './commitAttribution.js'

/**
 * Build PR trailer lines from attribution data. These are appended to the
 * PR body so that squash_merge_commit_message=PR_BODY repos get proper
 * git trailers on the resulting squash commit.
 *
 * @param attributionData  The computed attribution data (file-level stats)
 * @param attribution  The live attribution state from the session
 * @returns Array of trailer strings, e.g. ["Claude-authored: 72%", ...]
 */
export function buildPRTrailers(
  attributionData: AttributionData,
  _attribution: AttributionState | undefined,
): string[] {
  const trailers: string[] = []

  if (attributionData.summary) {
    const { claudePercent, humanPercent } = attributionData.summary
    if (claudePercent !== undefined) {
      trailers.push(`Claude-authored: ${Math.round(claudePercent)}%`)
    }
    if (humanPercent !== undefined) {
      trailers.push(`Human-authored: ${Math.round(humanPercent)}%`)
    }
  }

  return trailers
}
