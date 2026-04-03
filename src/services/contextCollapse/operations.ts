/**
 * Context collapse operations — provides a projected view of messages
 * where collapsed spans are replaced by their summaries.
 *
 * Reconstructed from caller context in context-noninteractive.ts and context.tsx.
 */

/**
 * Project the message view, replacing collapsed spans with their summary
 * placeholders. Used by /context commands to show the effective message
 * state after context collapse.
 *
 * @param view  The raw message view (array of message/span descriptors)
 * @returns The projected view with collapsed spans replaced
 */
export function projectView(view: any[]): any[] {
  // In the full implementation, this walks the view and replaces any
  // span that has been collapsed (committed) with its summary placeholder.
  // Spans that are staged but not yet committed remain expanded.
  return view
}
