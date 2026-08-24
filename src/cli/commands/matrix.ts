/**
 * Forge SDLC - Matrix Command Handler
 */

import { generateCapabilityMatrix } from '../../catalog/matrix.js';
import { UIFormatter } from '../ui/formatter.js';

export function handleMatrixCommand(options: { json?: boolean } = {}): void {
  const rows = generateCapabilityMatrix();

  if (options.json) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    UIFormatter.printMatrix(rows);
  }
}
