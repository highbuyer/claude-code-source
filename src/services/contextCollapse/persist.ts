/**
 * Context collapse persistence — save/restore the context collapse commit log
 * and staged snapshot across session resume/restore.
 *
 * Reconstructed from caller context in sessionRestore.ts and
 * ResumeConversation.tsx.
 */

import type { ContextCollapseCommitEntry, ContextCollapseSnapshotEntry } from '../../types/logs.js'

/**
 * Restore context collapse state from persisted entries. Must be called
 * before the first query() so projectView() can rebuild the collapsed view.
 *
 * Called unconditionally on resume (even with empty entries) because it
 * resets the store first — without that, an in-session /resume into a
 * session with no commits would leave stale state.
 *
 * @param contextCollapseCommits  Ordered commit entries (commit B may reference A's summary)
 * @param contextCollapseSnapshot  Last-wins staged queue + spawn state
 */
export function restoreFromEntries(
  contextCollapseCommits: ContextCollapseCommitEntry[],
  contextCollapseSnapshot?: ContextCollapseSnapshotEntry,
): void {
  // Reset the context collapse store, then replay commits in order.
  // Each commit registers its summary placeholder so that projectView()
  // can replace collapsed spans with their summaries during rendering.
  //
  // In the full implementation, this would:
  // 1. Clear the current collapse store
  // 2. Reseed the ID counter from max(collapseId) across entries
  // 3. For each commit, call registerSummary(summaryUuid, summaryContent)
  // 4. Restore the staged snapshot (pending collapses not yet committed)
  void contextCollapseCommits
  void contextCollapseSnapshot
}
