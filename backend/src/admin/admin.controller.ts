import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import {
  CreateLessonDto,
  CreateLevelDto,
  CreateModuleDto,
  CreateQuestionDto,
  CreateUnitDto,
  CreateVocabDto,
  UpdateLessonDto,
  UpdateQuestionDto,
  UpdateUnitDto,
} from './admin.dto';

@Roles(Role.ADMIN, Role.EDITOR)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Roles(Role.ADMIN)
  @Get('users')
  listUsers() {
    return this.adminService.listUsersWithBilling();
  }

  @Roles(Role.ADMIN)
  @Post('users/:id/grant-month')
  grantVipMonth(@Param('id') id: string, @Body() body?: { durationDays?: number }) {
    return this.adminService.grantVipMonth(id, body?.durationDays ?? 30);
  }

  @Get('curriculum')
  getCurriculum() {
    return this.adminService.getCurriculumTree();
  }

  @Post('levels')
  createLevel(@Body() dto: CreateLevelDto) {
    return this.adminService.createLevel(dto);
  }

  @Post('units')
  createUnit(@Body() dto: CreateUnitDto) {
    return this.adminService.createUnit(dto);
  }

  @Patch('units/:id')
  updateUnit(@Param('id') id: string, @Body() dto: UpdateUnitDto) {
    return this.adminService.updateUnit(id, dto);
  }

  @Delete('units/:id')
  deleteUnit(@Param('id') id: string) {
    return this.adminService.deleteUnit(id);
  }

  @Post('modules')
  createModule(@Body() dto: CreateModuleDto) {
    return this.adminService.createModule(dto);
  }

  @Post('lessons')
  createLesson(@Body() dto: CreateLessonDto) {
    return this.adminService.createLesson(dto);
  }

  @Get('lessons/:id')
  getLesson(@Param('id') id: string) {
    return this.adminService.getLesson(id);
  }

  @Patch('lessons/:id')
  updateLesson(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.adminService.updateLesson(id, dto);
  }

  @Delete('lessons/:id')
  deleteLesson(@Param('id') id: string) {
    return this.adminService.deleteLesson(id);
  }

  @Post('lessons/:lessonId/questions')
  createQuestion(@Param('lessonId') lessonId: string, @Body() dto: CreateQuestionDto) {
    return this.adminService.createQuestion(lessonId, dto);
  }

  @Patch('questions/:id')
  updateQuestion(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.adminService.updateQuestion(id, dto);
  }

  @Delete('questions/:id')
  deleteQuestion(@Param('id') id: string) {
    return this.adminService.deleteQuestion(id);
  }

  @Post('lessons/:lessonId/vocabulary')
  createVocab(@Param('lessonId') lessonId: string, @Body() dto: CreateVocabDto) {
    return this.adminService.createVocab(lessonId, dto);
  }

  @Delete('vocabulary/:id')
  deleteVocab(@Param('id') id: string) {
    return this.adminService.deleteVocab(id);
  }
}
