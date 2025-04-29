#!/usr/bin/env node

const { execSync } = require('child_process');
const { platform } = require('os');
const path = require('path');
const fs = require('fs');

function getPlaywrightBin() {
  const binDir = path.join(__dirname, '..', 'node_modules', '.bin');
  const isWindows = platform() === 'win32';
  const playwrightCmd = isWindows ? 'playwright.cmd' : 'playwright';
  const playwrightPath = path.join(binDir, playwrightCmd);

  if (!fs.existsSync(playwrightPath)) {
    console.error(`Cannot find Playwright binary at ${playwrightPath}`);
    process.exit(1);
  }

  return playwrightPath;
}

try {
  const playwright = getPlaywrightBin();

  if (platform() === 'linux') {
    console.log('Linux detected. Installing Playwright with OS dependencies...');
    execSync(`${playwright} install --with-deps`, { stdio: 'inherit' });
  } else {
    console.log('Non-Linux OS detected. Installing Playwright browsers only...');
    execSync(`${playwright} install`, { stdio: 'inherit' });
  }
} catch (err) {
  console.error('Error during Playwright postinstall:', err.message);
  process.exit(1);
}
