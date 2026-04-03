/** skillSearch/remoteSkillLoader — feature-gated module (reconstructed) */
export async function loadRemoteSkill(
  _slug: string,
  _url: string,
): Promise<any> {
  throw new Error('remoteSkillLoader stub: not implemented')
}

export function logRemoteSkillLoaded(_info: {
  slug: string
  cacheHit: boolean
  latencyMs: number
  urlScheme: string
  error?: string
}): void {}
