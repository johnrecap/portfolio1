import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const assetsDir = path.join(rootDir, 'dist', 'assets');

const budgets = [
  {
    label: 'public entry JavaScript',
    pattern: /^index-[\w-]+\.js$/,
    maxBytes: 205_000,
  },
  {
    label: 'public CSS',
    pattern: /^index-[\w-]+\.css$/,
    maxBytes: 115_000,
  },
];

function formatBytes(value) {
  return `${(value / 1024).toFixed(1)} KiB`;
}

async function findMatchingAsset(pattern) {
  const entries = await readdir(assetsDir);
  return entries.find((entry) => pattern.test(entry));
}

const failures = [];

for (const budget of budgets) {
  const fileName = await findMatchingAsset(budget.pattern);

  if (!fileName) {
    failures.push(`${budget.label}: asset not found`);
    continue;
  }

  const { size } = await stat(path.join(assetsDir, fileName));
  const summary = `${budget.label}: ${fileName} ${formatBytes(size)} / ${formatBytes(budget.maxBytes)}`;

  if (size > budget.maxBytes) {
    failures.push(summary);
  } else {
    console.log(summary);
  }
}

if (failures.length > 0) {
  console.error('Public bundle budget failures:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
