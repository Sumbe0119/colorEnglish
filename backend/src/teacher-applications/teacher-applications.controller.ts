// backend/src/teacher-applications/teacher-applications.controller.ts
// Зочны endpoint-ууд @Public() + throttle; админ хэсэг зөвхөн ADMIN роль.
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Role } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { TEACHER_PHOTO_URL_PREFIX, teacherPhotoUploadOptions } from '../uploads/teacher-photo-upload';
import {
  CreateTeacherApplicationDto,
  ListAdminTeacherApplicationsQueryDto,
  UpdateAdminTeacherApplicationDto,
} from './teacher-applications.dto';
import { TeacherApplicationsService } from './teacher-applications.service';

@Controller('teacher-applications')
export class TeacherApplicationsController {
  constructor(private service: TeacherApplicationsService) {}

  /** Цээж зураг upload → url (дараа нь submit-д photoUrl болгож өгнө) */
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('photo')
  @UseInterceptors(FileInterceptor('file', teacherPhotoUploadOptions))
  uploadPhoto(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Зураг сонгоно уу');
    return { url: `${TEACHER_PHOTO_URL_PREFIX}${file.filename}`, filename: file.filename };
  }

  /** CV илгээх */
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  submit(@Body() dto: CreateTeacherApplicationDto) {
    return this.service.create(dto);
  }
}

@Roles(Role.ADMIN)
@Controller('admin/teacher-applications')
export class TeacherApplicationsAdminController {
  constructor(private service: TeacherApplicationsService) {}

  @Get()
  list(@Query() query: ListAdminTeacherApplicationsQueryDto) {
    return this.service.adminList(query);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.adminGet(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdminTeacherApplicationDto) {
    return this.service.adminUpdate(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.adminDelete(id);
  }
}
