import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const aiPath = path.join(root, 'src/lib/ai.ts');
const dbPath = path.join(root, 'src/lib/db.ts');
const contactRoutePath = path.join(root, 'src/app/api/contact/route.ts');

assert(existsSync(aiPath), 'Missing src/lib/ai.ts');
const aiSource = readFileSync(aiPath, 'utf8');
assert(/import\s+["']server-only["'];/.test(aiSource), 'src/lib/ai.ts is missing server-only import.');

assert(existsSync(dbPath), 'Missing src/lib/db.ts');
const dbSource = readFileSync(dbPath, 'utf8');
assert(/import\s+["']server-only["'];/.test(dbSource), 'src/lib/db.ts is missing server-only import.');
assert(/PrismaClient/.test(dbSource), 'src/lib/db.ts should export a Prisma client singleton.');
const contactRouteSource = readFileSync(contactRoutePath, 'utf8');
assert(/@\/lib\/db/.test(contactRouteSource), 'Contact route should use src/lib/db.ts.');
assert(!/from\s+["']@prisma\/client["']/.test(contactRouteSource), 'Contact route should not instantiate Prisma directly.');

console.log('Server boundary checks passed.');
