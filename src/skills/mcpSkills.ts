/** skills/mcpSkills — feature-gated module (reconstructed) */
export const fetchMcpSkillsForClient: ((_client: any) => Promise<any[]>) & {
  cache: Map<string, any>
} = Object.assign(
  async (_client: any): Promise<any[]> => [],
  { cache: new Map<string, any>() },
)
