/**
 * Session data uploader — uploads session turn data for ant-internal builds.
 * Gated on runtime checks (github.com/anthropics/* remote + gcloud auth) and
 * CLAUDE_CODE_DISABLE_SESSION_DATA_UPLOAD env var.
 *
 * Reconstructed from caller context in main.tsx.
 */

import type { MessageType } from '../types/messages.js'

/**
 * Create a per-session uploader callback. Returns a function that receives
 * turn messages and uploads them asynchronously, or null if uploading is
 * not available/configured.
 *
 * Called once at session start; the returned callback is invoked on each
 * onTurnComplete.
 */
export async function createSessionTurnUploader(): Promise<
  ((messages: MessageType[]) => void) | null
> {
  // External builds: this module is dead code ("external" === 'ant' is false).
  // For completeness, implement the gating logic:
  if (process.env.CLAUDE_CODE_DISABLE_SESSION_DATA_UPLOAD === '1') {
    return null
  }

  // In a real ant-internal build this would check for gcloud auth and
  // anthropics/* git remote, then return an uploader function that POSTs
  // turn data to an internal service. In external builds, return null.
  return null
}
