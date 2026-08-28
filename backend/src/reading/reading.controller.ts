// backend/src/reading/reading.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReadingService } from './reading.service';
import {
  CreateReadingChapterDto,
  CreateReadingStoryDto,
  CreateReadingWordDto,
  ReadingTtsDto,
  SaveUserReadingWordDto,
  UpdateReadingChapterDto,
  UpdateReadingStoryDto,
  UpdateReadingWordDto,
} from './reading.dto';
import { coverUploadOptions } from '../uploads/cover-upload';
import { ElevenLabsService } from './elevenlabs.service';

@Controller('reading')
export class ReadingController {
  constructor(
    private readingService: ReadingService,
    private elevenLabs: ElevenLabsService,
  ) {}

  @Public()
  @Get('stories')
  listPublished() {
    return this.readingService.listPublished();
  }

  @Get('tts/status')
  ttsStatus() {
    return { enabled: this.elevenLabs.isConfigured(), provider: 'elevenlabs' };
  }

  @Post('tts')
  synthesize(@Body() dto: ReadingTtsDto) {
    return this.elevenLabs.synthesize(dto.text, {
      gender: dto.gender,
      rate: dto.rate,
    });
  }

  @Public()
  @Get('translate')
  translate(@Query('q') q: string, @Query('context') context?: string) {
    return this.readingService.translateText(q ?? '', context);
  }

  @Get('access')
  getAccess(@CurrentUser('userId') userId: string) {
    return this.readingService.getAccess(userId);
  }

  @Post('words/save')
  saveWord(@CurrentUser('userId') userId: string, @Body() dto: SaveUserReadingWordDto) {
    return this.readingService.saveUserWord(userId, dto);
  }

  @Get('words/mine')
  listMyWords(
    @CurrentUser('userId') userId: string,
    @Query('storyId') storyId?: string,
  ) {
    return this.readingService.listMyWords(userId, storyId);
  }

  @Delete('words/:id')
  deleteMyWord(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.readingService.deleteMyWord(userId, id);
  }

  @Post('stories/:id/quiz/complete')
  completeQuiz(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.readingService.completeQuiz(userId, id);
  }

  @Post('stories/:id/race/complete')
  completeRace(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.readingService.completeRace(userId, id);
  }

  @Get('stories/:id')
  getPublished(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.readingService.getPublished(id, userId);
  }
}

@Roles(Role.ADMIN, Role.EDITOR)
@Controller('admin/reading')
export class ReadingAdminController {
  constructor(private readingService: ReadingService) {}

  @Get('stories')
  listAll() {
    return this.readingService.listAll();
  }

  @Post('stories')
  create(@Body() dto: CreateReadingStoryDto) {
    return this.readingService.createStory(dto);
  }

  @Post('upload-cover')
  @UseInterceptors(FileInterceptor('file', coverUploadOptions))
  uploadCover(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Зураг сонгоно уу');
    return {
      url: `/api/uploads/covers/${file.filename}`,
      filename: file.filename,
    };
  }

  @Post('stories/:storyId/chapters')
  createChapter(@Param('storyId') storyId: string, @Body() dto: CreateReadingChapterDto) {
    return this.readingService.createChapter(storyId, dto);
  }

  @Post('stories/:storyId/words')
  addWord(@Param('storyId') storyId: string, @Body() dto: CreateReadingWordDto) {
    return this.readingService.addWord(storyId, dto);
  }

  @Post('stories/:id/auto-translate')
  autoTranslate(
    @Param('id') id: string,
    @Query('overwrite') overwrite?: string,
  ) {
    return this.readingService.autoTranslateStory(id, overwrite === 'true');
  }

  @Get('stories/:id')
  getById(@Param('id') id: string) {
    return this.readingService.getById(id);
  }

  @Patch('stories/:id')
  update(@Param('id') id: string, @Body() dto: UpdateReadingStoryDto) {
    return this.readingService.updateStory(id, dto);
  }

  @Delete('stories/:id')
  remove(@Param('id') id: string) {
    return this.readingService.deleteStory(id);
  }

  @Patch('chapters/:id')
  updateChapter(@Param('id') id: string, @Body() dto: UpdateReadingChapterDto) {
    return this.readingService.updateChapter(id, dto);
  }

  @Delete('chapters/:id')
  deleteChapter(@Param('id') id: string) {
    return this.readingService.deleteChapter(id);
  }

  @Post('chapters/:id/auto-translate')
  autoTranslateChapter(
    @Param('id') id: string,
    @Query('overwrite') overwrite?: string,
  ) {
    return this.readingService.autoTranslateChapter(id, overwrite === 'true');
  }

  @Patch('words/:id')
  updateWord(@Param('id') id: string, @Body() dto: UpdateReadingWordDto) {
    return this.readingService.updateWord(id, dto);
  }

  @Delete('words/:id')
  deleteWord(@Param('id') id: string) {
    return this.readingService.deleteWord(id);
  }
}
