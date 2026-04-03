/**
 * Install a prepare-commit-msg git hook in the given worktree that appends
 * attribution trailers to commit messages.
 *
 * Reconstructed from caller context in worktree.ts.
 */

import { join } from 'path'
import { mkdir, writeFile, chmod, readFile } from 'fs/promises'
import { logForDebugging } from './log.js'

const HOOK_NAME = 'prepare-commit-msg'
const HOOK_MARKER = '# claude-code-attribution'

/**
 * Install (or update) a prepare-commit-msg hook in the target git directory
 * that appends Claude Code attribution trailers to commit messages.
 *
 * @param worktreePath  Root of the git worktree
 * @param hooksDir  Optional override for the hooks directory (e.g. .husky)
 */
export async function installPrepareCommitMsgHook(
  worktreePath: string,
  hooksDir?: string,
): Promise<void> {
  const dir = hooksDir ?? join(worktreePath, '.git', 'hooks')

  try {
    await mkdir(dir, { recursive: true })
  } catch {
    // Directory may already exist
  }

  const hookPath = join(dir, HOOK_NAME)

  // Check if hook already exists and has our marker
  try {
    const existing = await readFile(hookPath, 'utf8')
    if (existing.includes(HOOK_MARKER)) {
      return // Already installed
    }
    // Hook exists but isn't ours — don't overwrite
    logForDebugging(
      `prepare-commit-msg hook already exists at ${hookPath}, skipping attribution hook`,
    )
    return
  } catch {
    // Hook doesn't exist — install it
  }

  const hookContent = `#!/bin/sh
${HOOK_MARKER}
# Appends Claude Code attribution trailers to commit messages.
# Installed by Claude Code; safe to remove.
`

  await writeFile(hookPath, hookContent, 'utf8')
  await chmod(hookPath, 0o755)
}
