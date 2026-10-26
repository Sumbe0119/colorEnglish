// backend/src/uploads/image-upload.ts
// Зураг upload хийх multer тохиргооны үүсгэгч — cover, цээж зураг зэрэгт нэг дүрэм:
// зөвхөн jpg/png/webp/gif, mimetype image/*, хэмжээний хязгаартай, нэр нь UUID.
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { ensureUploadDirs } from './uploads.paths';

const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024; // 5MB

ensureUploadDirs();

export function createImageUploadOptions(destination: string, maxBytes = DEFAULT_MAX_BYTES) {
  const reject = () => new BadRequestException('Зөвхөн jpg, png, webp, gif зураг оруулна');
  return {
    storage: diskStorage({
      destination,
      filename: (_req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase() || '.jpg';
        if (!ALLOWED.has(ext)) {
          cb(reject(), '');
          return;
        }
        cb(null, `${randomUUID()}${ext}`);
      },
    }),
    limits: { fileSize: maxBytes },
    fileFilter: (
      _req: Express.Request,
      file: Express.Multer.File,
      cb: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      const ext = extname(file.originalname).toLowerCase();
      if (!ALLOWED.has(ext) || !file.mimetype.startsWith('image/')) {
        cb(reject(), false);
        return;
      }
      cb(null, true);
    },
  };
}
