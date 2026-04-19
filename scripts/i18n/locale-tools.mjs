import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const cwd = process.cwd();
const enPath = path.join(cwd, 'src', 'locales', 'en.json');
const arPath = path.join(cwd, 'src', 'locales', 'ar.json');

const AR_FIXES = {
  services: {
    backend: 'هندسة الخوادم',
    backendDesc:
      'أبني بنية تحتية قوية تتحمل الضغط، وأصمم واجهات برمجة (APIs) آمنة واحترافية.',
  },
};

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function flattenKeys(obj, prefix = '') {
  const keys = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(keys, flattenKeys(value, fullKey));
    } else {
      keys[fullKey] = value;
    }
  }

  return keys;
}

function getByPath(obj, dottedPath) {
  return dottedPath.split('.').reduce((acc, part) => acc?.[part], obj);
}

function setByPath(obj, dottedPath, value) {
  const parts = dottedPath.split('.');
  let current = obj;

  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i];
    if (!current[part] || typeof current[part] !== 'object' || Array.isArray(current[part])) {
      current[part] = {};
    }
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
}

function findMissingKeys(source, target) {
  const sourceFlat = flattenKeys(source);
  const targetFlat = flattenKeys(target);

  return Object.keys(sourceFlat).filter((key) => !(key in targetFlat));
}

function printMissingKeys(missingKeys, source) {
  if (missingKeys.length === 0) {
    console.log('Locale parity check passed: no missing Arabic keys.');
    return;
  }

  console.log('Missing Arabic locale keys:');
  for (const key of missingKeys) {
    console.log(`- ${key}: ${JSON.stringify(getByPath(source, key))}`);
  }
}

function runCheck() {
  const en = readJson(enPath);
  const ar = readJson(arPath);
  const missingKeys = findMissingKeys(en, ar);

  printMissingKeys(missingKeys, en);

  process.exitCode = missingKeys.length === 0 ? 0 : 1;
}

function runFixAr() {
  const en = readJson(enPath);
  const ar = readJson(arPath);
  const fixes = flattenKeys(AR_FIXES);
  const applied = [];

  for (const [key, value] of Object.entries(fixes)) {
    if (getByPath(ar, key) === undefined) {
      setByPath(ar, key, value);
      applied.push(key);
    }
  }

  if (applied.length > 0) {
    writeFileSync(arPath, `${JSON.stringify(ar, null, 2)}\n`, 'utf8');
    console.log(`Applied Arabic locale fixes to ${path.relative(cwd, arPath)}:`);
    for (const key of applied) {
      console.log(`- ${key}`);
    }
  } else {
    console.log('No Arabic locale fixes were needed.');
  }

  const missingKeys = findMissingKeys(en, ar);
  printMissingKeys(missingKeys, en);
  process.exitCode = missingKeys.length === 0 ? 0 : 1;
}

function printHelp() {
  console.log('Usage: node scripts/i18n/locale-tools.mjs <check|fix-ar>');
}

const command = process.argv[2];

if (command === 'check') {
  runCheck();
} else if (command === 'fix-ar') {
  runFixAr();
} else {
  printHelp();
  process.exitCode = 1;
}
