/**
 * Sanitize inbound webhook content before injecting it into the REPL.
 * Prevents prompt injection and other malicious payloads from external
 * webhook sources.
 *
 * Reconstructed from caller context in useReplBridge.tsx.
 */

/**
 * Sanitize content received from an inbound webhook before it is processed
 * by the REPL bridge. Strips or escapes potentially dangerous constructs.
 *
 * @param content  Raw webhook payload content (string, object, or array)
 * @returns Sanitized content safe for injection into the conversation
 */
export function sanitizeInboundWebhookContent(content: any): any {
  if (typeof content === 'string') {
    // Strip common prompt injection patterns
    return content
      .replace(/<\/?system-reminder>/gi, '')
      .replace(/<\/?instructions>/gi, '')
      .replace(/<\/?tool_result>/gi, '')
  }

  if (Array.isArray(content)) {
    return content.map(sanitizeInboundWebhookContent)
  }

  if (content && typeof content === 'object') {
    const sanitized: Record<string, any> = {}
    for (const [key, value] of Object.entries(content)) {
      sanitized[key] = sanitizeInboundWebhookContent(value)
    }
    return sanitized
  }

  return content
}
