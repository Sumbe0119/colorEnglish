// backend/src/listening/listening.controller.ts
// Сонсох тоглоом — нэвтэрсэн хэрэглэгч (global JwtAuthGuard); /listening/admin/* зөвхөн ADMIN / EDITOR.
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateClipDto, SubmitAttemptDto, UpdateClipDto } from './listening.dto';
import { ListeningService } from './listening.service';
import { WordInfoService } from './word-info.service';

@Controller('listening')
export class ListeningController {
  constructor(
    private readonly listening: ListeningService,
    private readonly words: WordInfoService,
  ) {}

  @Get('clips')
  list(@CurrentUser('userId') userId: string) {
    return this.listening.listPublished(userId);
  }

  @Get('clips/:id')
  clip(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.listening.getClip(id, userId);
  }

  @Get('progress')
  progress(@CurrentUser('userId') userId: string) {
    return this.listening.progress(userId);
  }

  @Post('attempts')
  @HttpCode(HttpStatus.OK)
  submit(@CurrentUser('userId') userId: string, @Body() dto: SubmitAttemptDto) {
    return this.listening.submitAttempt(userId, dto);
  }

  /** Үгийн тайлбар (кэштэй). ?context=<өгүүлбэр> өгвөл контекст утгыг нэмнэ */
  @Get('words/:word')
  word(@Param('word') word: string, @Query('context') context?: string) {
    return this.words.getOrCreate(word, context?.slice(0, 300));
  }

  // ---------- Админ ----------

  @Get('admin/clips')
  @Roles(Role.ADMIN, Role.EDITOR)
  adminList() {
    return this.listening.adminList();
  }

  @Post('admin/clips')
  @Roles(Role.ADMIN, Role.EDITOR)
  adminCreate(@Body() dto: CreateClipDto) {
    return this.listening.adminCreate(dto);
  }

  @Patch('admin/clips/:id')
  @Roles(Role.ADMIN, Role.EDITOR)
  adminUpdate(@Param('id') id: string, @Body() dto: UpdateClipDto) {
    return this.listening.adminUpdate(id, dto);
  }

  @Post('admin/clips/:id/refetch')
  @Roles(Role.ADMIN, Role.EDITOR)
  adminRefetch(@Param('id') id: string) {
    return this.listening.adminRefetch(id);
  }

  @Delete('admin/clips/:id')
  @Roles(Role.ADMIN, Role.EDITOR)
  adminDelete(@Param('id') id: string) {
    return this.listening.adminDelete(id);
  }

  @Post('admin/words/:word/regenerate')
  @Roles(Role.ADMIN, Role.EDITOR)
  regenerate(@Param('word') word: string) {
    return this.words.getOrCreate(word, undefined, true);
  }

  @Get('admin/ai-status')
  @Roles(Role.ADMIN, Role.EDITOR)
  aiStatus() {
    return { ai: this.words.isAiConfigured() };
  }

  /** Бүх нийтэлсэн клипийн үгийн тайлбарыг урьдчилан бэлтгэнэ (байгааг алгасна) */
  @Post('admin/words/warm')
  @Roles(Role.ADMIN, Role.EDITOR)
  warm() {
    return this.listening.warmAll();
  }
}
