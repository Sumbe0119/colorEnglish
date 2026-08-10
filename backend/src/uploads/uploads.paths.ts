// backend/src/uploads/uploads.paths.ts
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Prefer backend/uploads relative to process.cwd() (nest runs from backend/).
 * Fallback: relative to compiled file (dist/uploads → ../../uploads).
 */
function resolveUploadsRoot() {
  const cwdPkg = join(process.cwd(), 'package.json');
  const fromCwd = join(process.cwd(), 'uploads');
  if (existsSync(cwdPkg) || existsSync(fromCwd)) {
    return fromCwd;
  }
  return join(__dirname, '..', '..', 'uploads');
}

export const UPLOADS_ROOT = resolveUploadsRoot();
export const COVERS_DIR = join(UPLOADS_ROOT, 'covers');

export function ensureUploadDirs() {
  for (const dir of [UPLOADS_ROOT, COVERS_DIR]) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }
}
