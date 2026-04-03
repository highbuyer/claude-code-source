/**
 * Skill search feature check — determines whether the experimental skill
 * search (auto-discovery) feature is enabled.
 *
 * Reconstructed from caller context in SkillTool.ts, prompts.ts, attachments.ts.
 */

import { feature } from 'bun:bundle'
import { checkStatsigFeatureGate_CACHED_MAY_BE_STALE } from '../analytics/growthbook.js'

/**
 * Check if the experimental skill search feature is enabled. When true,
 * the system can auto-discover and suggest skills based on context.
 *
 * Gated on the EXPERIMENTAL_SKILL_SEARCH feature flag and a Statsig gate.
 */
export function isSkillSearchEnabled(): boolean {
  if (!feature('EXPERIMENTAL_SKILL_SEARCH')) return false
  return checkStatsigFeatureGate_CACHED_MAY_BE_STALE('tengu_skill_search')
}
