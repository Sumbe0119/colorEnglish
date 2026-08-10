import { Controller, Get, Param, Query } from '@nestjs/common';
import { LevelCode, ModuleType } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurriculumService } from './curriculum.service';

@Controller('curriculum')
export class CurriculumController {
  constructor(private curriculumService: CurriculumService) {}

  @Public()
  @Get('levels')
  getLevels() {
    return this.curriculumService.getLevels();
  }

  @Public()
  @Get('levels/:code')
  getLevel(@Param('code') code: LevelCode) {
    return this.curriculumService.getLevelByCode(code);
  }

  @Public()
  @Get('units/:unitId')
  getUnit(@Param('unitId') unitId: string) {
    return this.curriculumService.getUnit(unitId);
  }

  @Get('modules/:moduleId')
  getModule(@Param('moduleId') moduleId: string) {
    return this.curriculumService.getModule(moduleId);
  }

  @Get('modules')
  getModulesByType(
    @Query('type') type: ModuleType,
    @Query('level') level?: LevelCode,
  ) {
    return this.curriculumService.getModulesByType(type, level);
  }

  @Get('lessons/:lessonId')
  getLesson(@Param('lessonId') lessonId: string, @CurrentUser('userId') userId: string) {
    return this.curriculumService.getLesson(lessonId, userId);
  }
}
