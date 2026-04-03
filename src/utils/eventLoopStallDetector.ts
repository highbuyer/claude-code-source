/**
 * Event loop stall detector — logs warnings when the main thread is blocked
 * for more than a threshold (e.g. >500ms). Ant-internal only.
 *
 * Reconstructed from caller context in main.tsx.
 */

import { logForDebugging } from './log.js'

const STALL_THRESHOLD_MS = 500
const CHECK_INTERVAL_MS = 200

/**
 * Start monitoring the Node.js event loop for stalls. Logs a warning when
 * the event loop is blocked for longer than STALL_THRESHOLD_MS.
 *
 * Only activated in ant-internal builds (`"external" === 'ant'`).
 */
export function startEventLoopStallDetector(): void {
  let lastCheck = Date.now()

  const timer = setInterval(() => {
    const now = Date.now()
    const delta = now - lastCheck
    lastCheck = now

    // If the delta between checks is much larger than the interval,
    // the event loop was blocked for that duration.
    const stallMs = delta - CHECK_INTERVAL_MS
    if (stallMs > STALL_THRESHOLD_MS) {
      logForDebugging(
        `Event loop stall detected: blocked for ~${Math.round(stallMs)}ms`,
      )
    }
  }, CHECK_INTERVAL_MS)

  // Don't prevent process exit
  timer.unref()
}
