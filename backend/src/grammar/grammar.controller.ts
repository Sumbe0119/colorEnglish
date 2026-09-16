import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GrammarService } from './grammar.service';
import { SubmitGrammarQuizDto } from './grammar.dto';
import { parseGrammarLevel } from './grammar-curriculum';

/** Дүрмийн (A1, A2, B1) хичээлийн явц — нэвтэрсэн хэрэглэгч (global JwtAuthGuard) */
@Controller('grammar')
export class GrammarController {
  constructor(private grammarService: GrammarService) {}

  @Get(':level/progress')
  getProgress(@CurrentUser('userId') userId: string, @Param('level') level: string) {
    return this.grammarService.getProgress(userId, this.level(level));
  }

  @Post(':level/rules/:ruleId/view')
  @HttpCode(HttpStatus.OK)
  markViewed(
    @CurrentUser('userId') userId: string,
    @Param('level') level: string,
    @Param('ruleId', ParseIntPipe) ruleId: number,
  ) {
    return this.grammarService.markViewed(userId, this.level(level), ruleId);
  }

  @Post(':level/quiz')
  @HttpCode(HttpStatus.OK)
  submitQuiz(
    @CurrentUser('userId') userId: string,
    @Param('level') level: string,
    @Body() dto: SubmitGrammarQuizDto,
  ) {
    return this.grammarService.submitQuiz(userId, this.level(level), dto.results);
  }

  private level(raw: string) {
    const level = parseGrammarLevel(raw);
    if (!level) throw new NotFoundException('Түвшин олдсонгүй');
    return level;
  }
}
