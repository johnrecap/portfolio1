import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  LIGHTHOUSE_DEFAULT_BASE_URL,
  LIGHTHOUSE_OUTPUT_ROOT,
  LIGHTHOUSE_PROFILES,
  LIGHTHOUSE_ROUTES,
} from './lighthouse.config.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const lighthouseBin = path.join(rootDir, 'node_modules', 'lighthouse', 'cli', 'index.js');

function parseArgs(argv) {
  const options = {
    profile: 'all',
    baseUrl: process.env.LIGHTHOUSE_BASE_URL || LIGHTHOUSE_DEFAULT_BASE_URL,
    routes: LIGHTHOUSE_ROUTES,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === '--profile' && next) {
      options.profile = next;
      index += 1;
    } else if (arg === '--base-url' && next) {
      options.baseUrl = next;
      index += 1;
    } else if (arg === '--route' && next) {
      const route = LIGHTHOUSE_ROUTES.find((item) => item.id === next || item.path === next);
      if (!route) {
        throw new Error(`Unknown Lighthouse route: ${next}`);
      }
      options.routes = [route];
      index += 1;
    }
  }

  return options;
}

function createTimestamp() {
  const date = new Date();
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function normalizeBaseUrl(value) {
  return value.replace(/\/$/, '');
}

function createUrl(baseUrl, routePath) {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  return routePath === '/' ? `${normalizedBase}/` : `${normalizedBase}${routePath}`;
}

async function runLighthouse({ url, profile, outputBasePath }) {
  const chromeTempDir = path.join(path.dirname(outputBasePath), 'chrome-temp');
  await mkdir(chromeTempDir, { recursive: true });

  const args = [
    lighthouseBin,
    url,
    '--quiet',
    '--output=json',
    '--output=html',
    `--output-path=${outputBasePath}`,
    '--only-categories=performance,accessibility,best-practices,seo',
    '--chrome-flags=--headless=new --incognito --disable-extensions --disable-dev-shm-usage --no-sandbox',
  ];

  if (profile === 'desktop') {
    args.push('--preset=desktop');
  }

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: rootDir,
      env: {
        ...process.env,
        TEMP: chromeTempDir,
        TMP: chromeTempDir,
      },
      stdio: 'inherit',
      windowsHide: true,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      if (existsSync(`${outputBasePath}.report.json`) || existsSync(`${outputBasePath}.json`)) {
        console.warn(`Lighthouse wrote a JSON report for ${url} (${profile}) but exited with ${code}; continuing.`);
        resolve();
        return;
      }

      reject(new Error(`Lighthouse failed for ${url} (${profile}) with exit code ${code}`));
    });
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const profiles = options.profile === 'all' ? LIGHTHOUSE_PROFILES : [options.profile];

  for (const profile of profiles) {
    if (!LIGHTHOUSE_PROFILES.includes(profile)) {
      throw new Error(`Unsupported Lighthouse profile: ${profile}`);
    }
  }

  const outputDir = path.join(rootDir, LIGHTHOUSE_OUTPUT_ROOT, createTimestamp());
  await mkdir(outputDir, { recursive: true });

  for (const profile of profiles) {
    for (const route of options.routes) {
      const url = createUrl(options.baseUrl, route.path);
      const outputBasePath = path.join(outputDir, `${profile}-${route.id}`);
      console.log(`Running Lighthouse ${profile}: ${url}`);
      await runLighthouse({ url, profile, outputBasePath });
    }
  }

  console.log(`Lighthouse reports written to ${path.relative(rootDir, outputDir)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
