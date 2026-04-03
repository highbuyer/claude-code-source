/**
 * Inter-Claude message passing for peer sessions. Used by SendMessageTool
 * to deliver messages between Claude Code instances (e.g. teammates).
 *
 * Reconstructed from caller context in SendMessageTool.ts.
 */

/**
 * Post a message to a peer Claude Code session. The target is resolved
 * from the REPL bridge handle registry.
 *
 * @param target  The peer session identifier or address
 * @param message  The message content to deliver
 * @returns An object with `ok: true` on success, or `ok: false` with error
 */
export async function postInterClaudeMessage(
  target: string,
  message: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    // In the full implementation, this resolves the target to a UDS socket
    // or HTTP endpoint via the REPL bridge handle, then sends the message.
    // The bridge handle includes the from= session identifier automatically.
    const { sendToUdsSocket } = await import('../utils/udsClient.js')
    await sendToUdsSocket(target, message)
    return { ok: true }
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    }
  }
}
