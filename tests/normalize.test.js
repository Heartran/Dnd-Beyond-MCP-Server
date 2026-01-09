const { normalizeDdbCharacter } = require('../src/models/character');
const fixture = require('./fixtures/ddb_example.json');

test('normalizeDdbCharacter maps key fields', () => {
  const n = normalizeDdbCharacter(fixture);
  expect(n.identity.name).toBe('Lira Swift');
  expect(n.statCore.STR).toBe(8);
  expect(n.combat.AC).toBe(15);
  expect(n.spells.length).toBe(2);
});