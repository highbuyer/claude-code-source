/**
 * Watches the terminal background color via OSC 11 queries and updates the
 * cached system theme when it changes. Returns a cleanup function.
 *
 * Reconstructed from caller context in ThemeProvider.tsx and systemTheme.ts.
 */

import type { TerminalQuerier } from '../ink/terminal-querier.js'
import type { SystemTheme } from './systemTheme.js'
import { setCachedSystemTheme, themeFromOscColor } from './systemTheme.js'

const POLL_INTERVAL_MS = 5_000

/**
 * Start watching the terminal background color. Fires an initial query
 * immediately, then polls at a fixed interval to detect live theme changes.
 *
 * @param querier  The terminal querier (from useStdin().internal_querier)
 * @param setTheme  Callback to update React state with the detected theme
 * @returns Cleanup function that stops the watcher
 */
export function watchSystemTheme(
  querier: TerminalQuerier,
  setTheme: (theme: SystemTheme) => void,
): () => void {
  let stopped = false

  async function poll() {
    if (stopped) return
    try {
      // OSC 11 queries the terminal background color
      const response = await querier.send({
        request: '\x1b]11;?\x07',
        match: (r: any) => {
          const raw =
            typeof r === 'string' ? r : r?.raw ?? r?.data ?? ''
          return /\x1b\]11;/.test(raw)
        },
      })
      if (stopped) return
      if (response) {
        const raw =
          typeof response === 'string'
            ? response
            : (response as any)?.raw ?? (response as any)?.data ?? ''
        // Extract the color data from the OSC 11 response
        const match = /\x1b\]11;(.+?)(?:\x07|\x1b\\)/.exec(raw)
        if (match?.[1]) {
          const theme = themeFromOscColor(match[1])
          if (theme) {
            setCachedSystemTheme(theme)
            setTheme(theme)
          }
        }
      }
      await querier.flush()
    } catch {
      // Terminal doesn't support OSC 11 — silently ignore
    }
  }

  // Initial query fires immediately
  void poll()

  // Periodic re-check for live theme changes (e.g. user toggled dark mode)
  const timer = setInterval(() => void poll(), POLL_INTERVAL_MS)

  return () => {
    stopped = true
    clearInterval(timer)
  }
}
