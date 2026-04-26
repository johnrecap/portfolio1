import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const demoDir = path.join(rootDir, 'demo');

const commands = {
  install: ['ci'],
  lint: ['run', 'lint'],
  build: ['run', 'build'],
};

const action = process.argv[2];

if (!commands[action]) {
  console.error(`Unknown demo action "${action}". Use one of: ${Object.keys(commands).join(', ')}`);
  process.exit(1);
}

const workspaces = fs.existsSync(demoDir)
  ? fs
      .readdirSync(demoDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(demoDir, entry.name))
      .filter((workspaceDir) => fs.existsSync(path.join(workspaceDir, 'package.json')))
  : [];

if (workspaces.length === 0) {
  console.log('No demo workspaces found.');
  process.exit(0);
}

for (const workspaceDir of workspaces) {
  const relativeName = path.relative(rootDir, workspaceDir);
  console.log(`\n> demo:${action} ${relativeName}`);

  const result =
    process.platform === 'win32'
      ? spawnSync('cmd.exe', ['/d', '/c', ['npm', ...commands[action]].join(' ')], {
          cwd: workspaceDir,
          stdio: 'inherit',
          shell: false,
        })
      : spawnSync('npm', commands[action], {
          cwd: workspaceDir,
          stdio: 'inherit',
          shell: false,
        });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
