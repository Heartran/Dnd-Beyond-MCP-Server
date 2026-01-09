# D&D Beyond MCP Server

Model Context Protocol (MCP) server for D&D Beyond character management using Node.js and Express.

## Overview

This server provides a provider-agnostic architecture for TTRPG tools. Currently implements D&D Beyond character import via JSON paste (no scraping or API calls).

## Features

- Import D&D Beyond characters from JSON
- Normalize character data to a common model
- Export characters to Markdown
- Query character stats, spells, and inventory
- Extensible provider system for future additions

## Setup

**Requirements:**
- Node.js 20+

**Installation:**
```bash
npm install
```

## Run Modes

### HTTP Server (Recommended)
```bash
PORT=5000 npm start
# Or with default port
npm start
```

The server will start on port 5000 (or specified PORT) and expose REST and MCP endpoints.

## API Endpoints

### Provider Discovery (REST)

#### List All Providers
```bash
GET /providers
```
Returns available providers with their id, name, and description.

#### Get Provider Tools
```bash
GET /providers/:id/tools
```
Returns tools exposed by a specific provider.

#### Call Provider Tool
```bash
POST /providers/:id/call
Content-Type: application/json

{
  "name": "tool_name",
  "args": { ... }
}
```

### MCP Endpoint

#### List Tools
```bash
POST /mcp
Content-Type: application/json

{ "type": "ListToolsRequest" }
```

#### Call Tool
```bash
POST /mcp
Content-Type: application/json

{
  "type": "CallToolRequest",
  "providerId": "ddb",
  "name": "tool_name",
  "args": { ... }
}
```

## D&D Beyond Provider

The `ddb` provider handles D&D Beyond character JSON imports.

### Available Tools

#### `ddb_import_character_json`
Import and normalize a D&D Beyond character from JSON.

**Example:**
```bash
curl -X POST http://localhost:5000/providers/ddb/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ddb_import_character_json",
    "args": {
      "json": {
        "id": "12345",
        "name": "Lira Swift",
        "race": "Half-Elf",
        "classes": [{"name": "Bard", "level": 5}],
        "abilities": {
          "Strength": 8,
          "Dexterity": 14,
          "Constitution": 12,
          "Intelligence": 10,
          "Wisdom": 11,
          "Charisma": 18
        },
        "ac": 15,
        "hp": 38,
        "items": [
          {"name": "Shortsword", "qty": 1},
          {"name": "Lute", "qty": 1}
        ],
        "spells": [
          {"name": "Cure Wounds", "level": 1, "prepared": true},
          {"name": "Faerie Fire", "level": 1}
        ]
      }
    }
  }'
```

**Response:**
```json
{
  "result": {
    "id": "character-id",
    "character": { ... }
  }
}
```

#### `character_get_overview`
Get character summary (name, classes, level, AC, HP).

**Example:**
```bash
curl -X POST http://localhost:5000/providers/ddb/call \
  -H "Content-Type: application/json" \
  -d '{"name": "character_get_overview", "args": {"id": "character-id"}}'
```

#### `character_list_spells`
Get all spells for a character.

**Example:**
```bash
curl -X POST http://localhost:5000/providers/ddb/call \
  -H "Content-Type: application/json" \
  -d '{"name": "character_list_spells", "args": {"id": "character-id"}}'
```

#### `character_list_inventory`
Get character's equipment and items.

**Example:**
```bash
curl -X POST http://localhost:5000/providers/ddb/call \
  -H "Content-Type: application/json" \
  -d '{"name": "character_list_inventory", "args": {"id": "character-id"}}'
```

#### `character_export_markdown`
Export complete character sheet as Markdown.

**Example:**
```bash
curl -X POST http://localhost:5000/providers/ddb/call \
  -H "Content-Type: application/json" \
  -d '{"name": "character_export_markdown", "args": {"id": "character-id"}}'
```

## Character Storage

Characters are stored as JSON files in `data/characters/` directory. Each character is saved with its ID as the filename: `{id}.json`

## Adding New Providers

The server is designed to be provider-agnostic. To add a new provider:

1. Create a new directory in `src/providers/your-provider/`
2. Implement the provider interface (see `src/providers/provider.js`)
3. Register it in `src/providers/index.js`

Example provider structure:
```javascript
const provider = {
  id: 'your-provider',
  name: 'Your Provider Name',
  description: 'Provider description',
  tools: [
    {
      name: 'tool_name',
      description: 'Tool description',
      inputSchema: { type: 'object', properties: {...}, required: [] }
    }
  ],
  async callTool(name, args) {
    // Implementation
  }
};

module.exports = provider;
```

## Development

### Running Tests
```bash
npm test
```

### Manual Test Run
```bash
node test/run-tests.js
```

## Project Structure

```
.
├── index.js                    # Express server entry point
├── config.js                   # Provider configuration
├── src/
│   ├── models/
│   │   └── character.js        # Character normalization
│   ├── providers/
│   │   ├── index.js           # Provider registry
│   │   ├── provider.js        # Provider interface
│   │   └── ddb/
│   │       └── ddbProvider.js # D&D Beyond implementation
│   └── storage/
│       └── characterStore.js  # File-based storage
├── data/
│   └── characters/            # Character JSON files
└── tests/
    ├── fixtures/              # Test data
    └── *.test.js             # Test files
```

## Deployment

Use the included `run.ps1` PowerShell script for auto-restart on git changes:

```powershell
.\run.ps1
```

Features:
- Auto-pull from git every 5 minutes
- Restart server on changes
- Restart on crash
- Exposes port 5000 via Tailscale funnel

## License

MIT

## Contributing

See `AGENTS.md` for development guidelines and git workflow.
