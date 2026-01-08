const ddb = require('./ddb/ddbProvider');
const { validateProvider } = require('./provider');

const providers = { };

function register(p) {
  validateProvider(p);
  providers[p.id] = p;
}

// Kanka provider is deprecated and no longer registered.
// To re-enable, restore the provider implementation under src/providers/kanka and uncomment the require/register lines.
// const kanka = require('./kanka/kankaProvider');
// register(kanka);

register(ddb);

function listProviders() {
  return Object.values(providers).map(p => ({ id: p.id, name: p.name, description: p.description }));
}

function getProvider(id) {
  return providers[id];
}

module.exports = {
  register,
  listProviders,
  getProvider,
};