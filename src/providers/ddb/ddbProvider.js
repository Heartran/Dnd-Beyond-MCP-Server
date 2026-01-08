const { normalizeDdbCharacter } = require('../../models/character');
const { saveCharacter, loadCharacter } = require('../../storage/characterStore');
const { v4: uuidv4 } = require('uuid');

const provider = {
  id: 'ddb',
  name: 'D&D Beyond (JSON import)',
  description: 'Importa personaggi da JSON incollato (nessun scraping). Normalizza in CharacterModel.',
  tools: [
    {
      name: 'ddb_import_character_json',
      description: 'Importa un JSON DDB e lo normalizza; args: { json: object, id?: string }',
      inputSchema: { type: 'object', properties: { json: { type: 'object' }, id: { type: 'string' } }, required: ['json'] },
    },
    { name: 'character_get_overview', description: 'Ritorna overview: name, classes, level, AC, HP', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
    { name: 'character_list_spells', description: 'Ritorna la lista di incantesimi', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
    { name: 'character_list_inventory', description: 'Ritorna inventario', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
    { name: 'character_export_markdown', description: 'Esporta il personaggio in markdown', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  ],

  async callTool(name, args) {
    switch (name) {
      case 'ddb_import_character_json': {
        if (!args || !args.json) throw new Error('args.json required');
        const normalized = normalizeDdbCharacter(args.json);
        const id = args.id || normalized.identity.id || uuidv4();
        await saveCharacter(id, normalized);
        return { id, character: normalized };
      }
      case 'character_get_overview': {
        const c = await loadCharacter(args.id);
        return {
          id: args.id,
          name: c.identity.name,
          classes: c.identity.classes,
          level: Array.isArray(c.identity.classes) ? c.identity.classes.map((cl) => cl.level).filter(Boolean) : null,
          AC: c.combat.AC,
          HP: c.combat.hp,
        };
      }
      case 'character_list_spells': {
        const c = await loadCharacter(args.id);
        return c.spells || [];
      }
      case 'character_list_inventory': {
        const c = await loadCharacter(args.id);
        return c.equipment || [];
      }
      case 'character_export_markdown': {
        const c = await loadCharacter(args.id);
        const lines = [];
        lines.push(`# ${c.identity.name}`);
        lines.push(`**Race:** ${c.identity.race || '—'}`);
        lines.push(`**Classes:** ${(c.identity.classes || []).map(cl => (cl.name || JSON.stringify(cl))).join(', ')}`);
        lines.push('');
        lines.push(`**AC:** ${c.combat.AC || '—'}  |  **HP:** ${c.combat.hp.current || '—'}/${c.combat.hp.max || '—'}`);
        lines.push('');
        lines.push('## Spells');
        for (const s of (c.spells || [])) lines.push(`- ${s.name} (lvl ${s.level || '?'})${s.prepared ? ' [prepared]' : ''}`);
        lines.push('');
        lines.push('## Equipment');
        for (const e of (c.equipment || [])) lines.push(`- ${e.qty || 1}x ${e.name}${e.attuned ? ' (attuned)' : ''}${e.notes ? ' — ' + e.notes : ''}`);
        return lines.join('\n');
      }
      default:
        throw new Error('Unknown tool ' + name);
    }
  },
};

module.exports = provider;