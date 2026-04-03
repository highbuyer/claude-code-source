/**
 * Task summary generation — generates summaries of completed tasks for
 * background sessions. Gated on feature('BG_SESSIONS').
 *
 * Reconstructed from caller context in query.ts.
 */

/**
 * Check whether a task summary should be generated for the current turn.
 * Returns true when conditions are met (e.g. enough turns elapsed,
 * not in a subagent context).
 */
export function shouldGenerateTaskSummary(): boolean {
  // In the full implementation, this checks turn count thresholds and
  // session type. Conservative default: disabled in reconstructed build.
  return false
}

/**
 * Generate a task summary asynchronously. Fire-and-forget — errors are
 * logged but do not interrupt the main query loop.
 *
 * @param context  The current query context (system prompt, messages, etc.)
 */
export function maybeGenerateTaskSummary(_context: {
  systemPrompt?: string
  userContext?: any
  systemContext?: any
  toolUseContext?: any
  forkContextMessages?: any[]
}): void {
  // In the full implementation, this forks a lightweight LLM call to
  // summarize the conversation so far, storing the result for the
  // background session manager. No-op in reconstructed build.
}
