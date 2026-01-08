const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'characters');

async function ensureDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function saveCharacter(id, obj) {
  await ensureDir();
  const file = path.join(DATA_DIR, `${id}.json`);
  await writeFile(file, JSON.stringify(obj, null, 2), 'utf8');
  return file;
}

async function loadCharacter(id) {
  const file = path.join(DATA_DIR, `${id}.json`);
  const raw = await readFile(file, 'utf8');
  return JSON.parse(raw);
}

module.exports = {
  saveCharacter,
  loadCharacter,
  DATA_DIR,
};