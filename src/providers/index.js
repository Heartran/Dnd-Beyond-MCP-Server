// Provider registry for D&D Beyond MCP Server
// Add new providers here by requiring and registering them

import ddb from './ddb/ddbProvider.js';

const providers = new Map();

function register(provider) {
  if (!provider || !provider.id) {
    throw new Error('Provider must have an id');
  }
  providers.set(provider.id, provider);
  console.log(`Registered provider: ${provider.id} (${provider.name})`);
}

function listProviders() {
  return Array.from(providers.values()).map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
  }));
}

function getProvider(id) {
  return providers.get(id);
}

// Register D&D Beyond provider
register(ddb);

export default {
  register,
  listProviders,
  getProvider,
};
