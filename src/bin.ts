#!/usr/bin/env node

/**
 * Forge SDLC - Executable Binary Entrypoint
 */

import { createCliApp } from './cli/app.js';

const app = createCliApp();
app.parseAsync(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
