function slugify(s = 'unnamed') {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function normalizeDdbCharacter(raw = {}) {
  const identity = {
    id: raw.id || raw.character?.id || null,
    name: raw.name || raw.character?.name || 'Unknown',
    race: raw.race || raw.character?.race || '',
    classes: raw.classes || raw.character?.classes || [],
    background: raw.background || '',
  };

  const abilities = raw.abilities || raw.ability_scores || {};
  const statCore = {
    STR: abilities.Strength ?? abilities.str ?? 10,
    DEX: abilities.Dexterity ?? abilities.dex ?? 10,
    CON: abilities.Constitution ?? abilities.con ?? 10,
    INT: abilities.Intelligence ?? abilities.int ?? 10,
    WIS: abilities.Wisdom ?? abilities.wis ?? 10,
    CHA: abilities.Charisma ?? abilities.cha ?? 10,
    mod: {},
  };
  ['STR','DEX','CON','INT','WIS','CHA'].forEach(k => { statCore.mod[k] = Math.floor((statCore[k]-10)/2); });

  const combat = {
    AC: raw.ac ?? raw.armor_class ?? null,
    hp: {
      max: raw.hp_max ?? raw.hit_points_max ?? null,
      current: raw.hp ?? raw.hit_points ?? null,
      temp: raw.hp_temp ?? 0,
    },
    initiative: raw.initiative ?? null,
    speed: raw.speed ?? null,
  };

  const equipment = Array.isArray(raw.items) ? raw.items.map(i => ({ name: i.name, qty: i.qty || 1, attuned: !!i.attuned, notes: i.notes || '' })) : [];
  const spells = Array.isArray(raw.spells) ? raw.spells.map(s => ({ name: s.name, level: s.level, prepared: !!s.prepared })) : [];

  return {
    identity,
    statCore,
    combat,
    equipment,
    spells,
    _raw: raw,
    slug: slugify(identity.name) + (identity.id ? `-${identity.id}` : ''),
  };
}

module.exports = { normalizeDdbCharacter };