/**
 * Unix domain socket (UDS) client for inter-process communication between
 * Claude Code sessions (background sessions, daemon, peer agents).
 *
 * Reconstructed from caller context in conversationRecovery.ts and
 * SendMessageTool.ts.
 */

import { connect } from 'net'

/**
 * Send a message to a peer session via its Unix domain socket.
 *
 * @param target  The UDS socket path
 * @param message  The message payload to send
 */
export async function sendToUdsSocket(
  target: string,
  message: string,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const socket = connect(target, () => {
      socket.write(message, err => {
        socket.end()
        if (err) reject(err)
        else resolve()
      })
    })
    socket.on('error', reject)
    // Prevent hanging on unresponsive sockets
    socket.setTimeout(5_000, () => {
      socket.destroy(new Error(`UDS connection to ${target} timed out`))
    })
  })
}

/**
 * List all live Claude Code sessions by querying the daemon's UDS endpoint.
 * Returns session descriptors with at least `sessionId` and `kind` fields.
 */
export async function listAllLiveSessions(): Promise<
  Array<{ sessionId: string; kind?: string; [key: string]: any }>
> {
  // The daemon maintains a registry of active sessions. Query it via the
  // well-known socket path. If the daemon isn't running, return empty.
  try {
    const { getDaemonSocketPath } = await import('../daemon/main.js')
    const socketPath = getDaemonSocketPath?.() ?? ''
    if (!socketPath) return []

    return await new Promise((resolve, reject) => {
      const socket = connect(socketPath, () => {
        socket.write(JSON.stringify({ type: 'list_sessions' }))
      })
      let data = ''
      socket.on('data', chunk => {
        data += chunk.toString()
      })
      socket.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          resolve(Array.isArray(parsed) ? parsed : parsed.sessions ?? [])
        } catch {
          resolve([])
        }
      })
      socket.on('error', () => resolve([]))
      socket.setTimeout(3_000, () => {
        socket.destroy()
        resolve([])
      })
    })
  } catch {
    return []
  }
}
