// backend/src/uploads/teacher-photo-upload.ts
// Багшаар ажиллах хүсэлтийн цээж зураг — нэвтрэхгүй upload хийгдэнэ (throttle-тэй)
import { TEACHER_PHOTOS_DIR } from './uploads.paths';
import { createImageUploadOptions } from './image-upload';

export const TEACHER_PHOTO_URL_PREFIX = '/api/uploads/teacher-photos/';

export const teacherPhotoUploadOptions = createImageUploadOptions(TEACHER_PHOTOS_DIR);
