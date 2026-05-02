import { existsSync } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { LIGHTHOUSE_OUTPUT_ROOT, LIGHTHOUSE_THRESHOLDS } from './lighthouse.config.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function parseArgs(argv) {
  const options = {
    dir: '',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === '--dir' && next) {
      options.dir = next;
      index += 1;
    }
  }

  return options;
}

async function findLatestReportDir() {
  const outputRoot = path.join(rootDir, LIGHTHOUSE_OUTPUT_ROOT);
  if (!existsSync(outputRoot)) {
    throw new Error(`No Lighthouse output directory found at ${LIGHTHOUSE_OUTPUT_ROOT}`);
  }

  const entries = await readdir(outputRoot);
  const dirs = [];

  for (const entry of entries) {
    const fullPath = path.join(outputRoot, entry);
    const entryStat = await stat(fullPath);
    if (entryStat.isDirectory()) {
      dirs.push({ fullPath, mtimeMs: entryStat.mtimeMs });
    }
  }

  if (dirs.length === 0) {
    throw new Error(`No Lighthouse report runs found under ${LIGHTHOUSE_OUTPUT_ROOT}`);
  }

  dirs.sort((left, right) => right.mtimeMs - left.mtimeMs);
  return dirs[0].fullPath;
}

function routeIdFromReportName(fileName) {
  return fileName
    .replace(/^mobile-/, '')
    .replace(/^desktop-/, '')
    .replace(/\.report\.json$/, '')
    .replace(/\.json$/, '');
}

function thresholdForRoute(routeId) {
  return LIGHTHOUSE_THRESHOLDS[routeId] || LIGHTHOUSE_THRESHOLDS.default;
}

async function readJsonReports(reportDir) {
  const entries = await readdir(reportDir);
  const jsonFiles = entries.filter((entry) => entry.endsWith('.json'));

  if (jsonFiles.length === 0) {
    throw new Error(`No Lighthouse JSON reports found in ${path.relative(rootDir, reportDir)}`);
  }

  return Promise.all(
    jsonFiles.map(async (fileName) => {
      const fullPath = path.join(reportDir, fileName);
      return {
        fileName,
        routeId: routeIdFromReportName(fileName),
        report: JSON.parse(await readFile(fullPath, 'utf8')),
      };
    }),
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const reportDir = options.dir ? path.resolve(rootDir, options.dir) : await findLatestReportDir();
  const reports = await readJsonReports(reportDir);
  const failures = [];

  for (const { fileName, routeId, report } of reports) {
    const thresholds = thresholdForRoute(routeId);
    for (const [category, threshold] of Object.entries(thresholds)) {
      const score = report.categories?.[category]?.score;

      if (typeof score !== 'number') {
        failures.push(`${fileName}: missing ${category} score`);
        continue;
      }

      if (score < threshold) {
        failures.push(`${fileName}: ${category} ${Math.round(score * 100)} < ${Math.round(threshold * 100)}`);
      }
    }
  }

  if (failures.length > 0) {
    console.error('Lighthouse budget failures:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log(`Lighthouse budgets passed for ${reports.length} report(s) in ${path.relative(rootDir, reportDir)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

