import express from "express";
import bodyParser from "body-parser";
const providers = require('./src/providers');

const app = express();
app.use(bodyParser.json());

// Providers discovery
function createProviderServer() {
  const router = express.Router();

  // REST helpers
  router.get('/providers', (req, res) => {
    res.json(providers.listProviders());
  });

  router.get('/providers/:id/tools', (req, res) => {
    const p = providers.getProvider(req.params.id);
    if (!p) return res.status(404).json({ error: 'provider not found' });
    res.json(p.tools);
  });

  router.post('/providers/:id/call', async (req, res) => {
    const p = providers.getProvider(req.params.id);
    if (!p) return res.status(404).json({ error: 'provider not found' });
    try {
      const result = await p.callTool(req.body.name, req.body.args || {});
      res.json({ result });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: String(err) });
    }
  });

  // MCP-like single endpoint that understands two request types:
  // { type: 'ListToolsRequest' }
  // { type: 'CallToolRequest', providerId, name, args }
  router.post('/mcp', async (req, res) => {
    const body = req.body || {};
    try {
      if (body.type === 'ListToolsRequest') {
        // union of all provider tools
        const list = [];
        for (const p of providers.listProviders()) {
          const provider = providers.getProvider(p.id);
          (provider.tools || []).forEach(t => list.push({ providerId: p.id, providerName: p.name, name: t.name, description: t.description, inputSchema: t.inputSchema }));
        }
        return res.json({ tools: list });
      } else if (body.type === 'CallToolRequest') {
        if (!body.providerId) return res.status(400).json({ error: 'providerId required' });
        const provider = providers.getProvider(body.providerId);
        if (!provider) return res.status(404).json({ error: 'provider not found' });
        const result = await provider.callTool(body.name, body.args || {});
        return res.json({ result });
      } else {
        return res.status(400).json({ error: 'unknown request type' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: String(err) });
    }
  });

  return router;
}

// mount provider server
app.use('/', createProviderServer());

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.error(`D&D Beyond MCP Server listening on port ${PORT} (HTTP)`);
});
