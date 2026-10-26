// backend/src/teacher-applications/teacher-applications.module.ts
import { Module } from '@nestjs/common';
import {
  TeacherApplicationsAdminController,
  TeacherApplicationsController,
} from './teacher-applications.controller';
import { TeacherApplicationsService } from './teacher-applications.service';

/** Багшаар ажиллах хүсэлт (CV) — нүүр хуудасны footer-оос илгээж, админ хянана */
@Module({
  controllers: [TeacherApplicationsController, TeacherApplicationsAdminController],
  providers: [TeacherApplicationsService],
})
export class TeacherApplicationsModule {}
