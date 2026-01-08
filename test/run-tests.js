const assert = require('assert');
const fs = require('fs');
const path = require('path');

const providers = require('../src/providers');
const fixture = require('../tests/fixtures/ddb_example.json');

(async () => {
  try {
    console.log('Test: import DDB JSON via provider');
    const provider = providers.getProvider('ddb');
    assert(provider, 'ddb provider registered');

    const { result } = await provider.callTool('ddb_import_character_json', { json: fixture });
    assert(result.id, 'returned id');
    assert(result.character.identity.name === 'Lira Swift', 'name normalized');
    assert(result.character.statCore.STR === 8, 'STR preserved');
    assert(result.character.combat.AC === 15, 'AC preserved');

    const overview = await provider.callTool('character_get_overview', { id: result.id });
    assert(overview.name === 'Lira Swift', 'overview name ok');
    const spells = await provider.callTool('character_list_spells', { id: result.id });
    assert(Array.isArray(spells) && spells.length === 2, 'spells present');

    const md = await provider.callTool('character_export_markdown', { id: result.id });
    assert(typeof md === 'string' && md.includes('# Lira Swift'), 'markdown export ok');

    console.log('All tests passed ✅');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
})();