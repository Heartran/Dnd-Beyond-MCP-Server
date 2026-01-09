import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'characters');

async function ensureDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function saveCharacter(id, obj) {
  await ensureDir();
  const file = path.join(DATA_DIR, `${id}.json`);
  await writeFile(file, JSON.stringify(obj, null, 2), 'utf8');
  return file;
}

export async function loadCharacter(id) {
  const file = path.join(DATA_DIR, `${id}.json`);
  const raw = await readFile(file, 'utf8');
  return JSON.parse(raw);
}

export { DATA_DIR };
