// Minimal Provider "interface" doc + helper
/**
 * Provider shape:
 * {
 *   id: string,
 *   name: string,
 *   description?: string,
 *   tools: Array<{ name, description, inputSchema? }>,
 *   callTool(name: string, args: object): Promise<any>
 * }
 */

function validateProvider(p) {
  if (!p || !p.id || !p.name || typeof p.callTool !== 'function') {
    throw new Error('Invalid provider shape');
  }
}

module.exports = {
  validateProvider,
};