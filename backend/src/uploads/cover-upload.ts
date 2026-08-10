// backend/src/uploads/cover-upload.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { COVERS_DIR, ensureUploadDirs } from './uploads.paths';

const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

ensureUploadDirs();

export const coverUploadOptions = {
  storage: diskStorage({
    destination: COVERS_DIR,
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase() || '.jpg';
      if (!ALLOWED.has(ext)) {
        cb(new Error('Зөвхөн jpg, png, webp, gif зураг оруулна'), '');
        return;
      }
      cb(null, `${randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const ext = extname(file.originalname).toLowerCase();
    if (!ALLOWED.has(ext) || !file.mimetype.startsWith('image/')) {
      cb(new Error('Зөвхөн jpg, png, webp, gif зураг оруулна'), false);
      return;
    }
    cb(null, true);
  },
};
