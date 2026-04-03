/**
 * Coordinator worker agent definitions — provides agent definitions for
 * coordinator mode (CLAUDE_CODE_COORDINATOR_MODE=1).
 *
 * Reconstructed from caller context in builtInAgents.ts and coordinatorMode.ts.
 */

import type { AgentDefinition } from '../tools/AgentTool/loadAgentsDir.js'

/**
 * Get the set of built-in agents available in coordinator mode.
 * These agents are specialized workers that the coordinator can delegate to.
 *
 * Only called when feature('COORDINATOR_MODE') is enabled and
 * CLAUDE_CODE_COORDINATOR_MODE is truthy.
 */
export function getCoordinatorAgents(): AgentDefinition[] {
  // In the full implementation, this returns specialized worker agent
  // definitions for coordinator mode (e.g. executor, researcher, reviewer).
  // These are built-in agents that the coordinator orchestrates.
  return []
}
