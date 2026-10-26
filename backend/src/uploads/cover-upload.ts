// backend/src/uploads/cover-upload.ts
import { COVERS_DIR } from './uploads.paths';
import { createImageUploadOptions } from './image-upload';

export const coverUploadOptions = createImageUploadOptions(COVERS_DIR);
