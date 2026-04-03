/**
 * SDK heap dump monitor — periodically checks heap usage and triggers
 * diagnostics when memory grows beyond thresholds. Ant-internal only.
 *
 * Reconstructed from caller context in main.tsx.
 */

import { logForDebugging } from './log.js'

const CHECK_INTERVAL_MS = 30_000
const HEAP_WARNING_MB = 512

/**
 * Start periodic heap usage monitoring. Logs warnings when heap usage
 * exceeds thresholds to help diagnose memory leaks.
 *
 * Only activated in ant-internal builds (`"external" === 'ant'`).
 */
export function startSdkMemoryMonitor(): void {
  const timer = setInterval(() => {
    const usage = process.memoryUsage()
    const heapMB = Math.round(usage.heapUsed / 1024 / 1024)

    if (heapMB > HEAP_WARNING_MB) {
      logForDebugging(
        `High heap usage: ${heapMB}MB (heap total: ${Math.round(usage.heapTotal / 1024 / 1024)}MB, ` +
          `rss: ${Math.round(usage.rss / 1024 / 1024)}MB)`,
      )
    }
  }, CHECK_INTERVAL_MS)

  // Don't prevent process exit
  timer.unref()
}
