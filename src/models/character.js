const slugify = (s) => (s || 'unnamed').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function normalizeDdbCharacter(raw) {
  // baseline, resilient mapping from typical DDB-like blobs
  const identity = {
    id: raw.id || null,
    name: raw.name || raw.character?.name || 'Unknown',
    race: raw.race || raw.character?.race || raw.race_name || '',
    classes: raw.classes || raw.character?.classes || (raw.class ? [raw.class] : []),
    background: raw.background || raw.character?.background || '',
  };

  const statsSource = raw.abilities || raw.ability_scores || raw.stats || {};
  const statCore = {
    STR: statsSource.Strength ?? statsSource.str ?? 10,
    DEX: statsSource.Dexterity ?? statsSource.dex ?? 10,
    CON: statsSource.Constitution ?? statsSource.con ?? 10,
    INT: statsSource.Intelligence ?? statsSource.int ?? 10,
    WIS: statsSource.Wisdom ?? statsSource.wis ?? 10,
    CHA: statsSource.Charisma ?? statsSource.cha ?? 10,
    mod: {}, // computed mods
  };
  for (const k of ['STR','DEX','CON','INT','WIS','CHA']) {
    statCore.mod[k] = Math.floor((statCore[k] - 10) / 2);
  }

  const combat = {
    AC: raw.ac ?? raw.armor_class ?? null,
    hp: {
      max: raw.hp_max ?? raw.hit_points_max ?? null,
      current: raw.hp ?? raw.hit_points ?? null,
      temp: raw.hp_temp ?? 0,
    },
    initiative: raw.initiative ?? null,
    speed: raw.speed ?? (raw.movement && raw.movement.walk) || null,
  };

  const skills = raw.skills || {};
  const resources = raw.resources || {};
  const equipment = Array.isArray(raw.items) ? raw.items.map(i => ({ name: i.name, qty: i.qty || 1, attuned: !!i.attuned, notes: i.notes || '' })) : [];

  const spells = Array.isArray(raw.spells) ? raw.spells.map(s => ({ name: s.name, level: s.level, prepared: !!s.prepared })) : [];

  return {
    identity,
    statCore,
    combat,
    skills,
    resources,
    equipment,
    spells,
    _raw: raw,
    slug: slugify(identity.name) + (identity.id ? `-${identity.id}` : ''),
  };
}

module.exports = {
  normalizeDdbCharacter,
};