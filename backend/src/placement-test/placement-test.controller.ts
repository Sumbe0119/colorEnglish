// backend/src/placement-test/placement-test.controller.ts
// Зочны endpoint-ууд @Public() — эзэмшлийг X-Placement-Token header-ээр нотолно.
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Role } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  AdminConfirmPlacementDto,
  ListAdminPlacementQueryDto,
  PayPlacementDto,
  SubmitPlacementDto,
} from './placement-test.dto';
import { PlacementTestService } from './placement-test.service';

export const PLACEMENT_TOKEN_HEADER = 'x-placement-token';

@Controller('placement-test')
export class PlacementTestController {
  constructor(private service: PlacementTestService) {}

  /** Үнэ, асуултын тоо — нүүр хуудасны танилцуулгад */
  @Public()
  @Get('config')
  config() {
    return this.service.getConfig();
  }

  /** Асуултууд (зөв хариултгүй) */
  @Public()
  @Get('questions')
  questions() {
    return this.service.getQuestions();
  }

  /** Хариулт илгээх → attempt id + нууц түлхүүр (үр дүн түгжээтэй) */
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @Post('attempts')
  @HttpCode(HttpStatus.CREATED)
  async submit(@Body() dto: SubmitPlacementDto, @Headers('authorization') auth?: string) {
    const userId = await this.service.resolveOptionalUserId(auth);
    return this.service.submit(dto, userId);
  }

  /** QPay callback — callback URL-д attempt_id query-оор өгсөн */
  @Public()
  @Get('qpay-callback')
  qpayCallbackGet(
    @Query('attempt_id') attemptId?: string,
    @Query('payment_id') paymentId?: string,
    @Query('invoice_id') invoiceId?: string,
  ) {
    return this.service.handleQpayCallback(attemptId || paymentId, invoiceId);
  }

  @Public()
  @Post('qpay-callback')
  qpayCallbackPost(
    @Query('attempt_id') attemptId?: string,
    @Query('payment_id') paymentId?: string,
    @Query('invoice_id') invoiceId?: string,
    @Body() body?: { attempt_id?: string; payment_id?: string; invoice_id?: string },
  ) {
    return this.service.handleQpayCallback(
      attemptId || paymentId || body?.attempt_id || body?.payment_id,
      invoiceId || body?.invoice_id,
    );
  }

  /** Төлөв (+ төлсөн бол үр дүн) */
  @Public()
  @Get('attempts/:id')
  getAttempt(@Param('id') id: string, @Headers(PLACEMENT_TOKEN_HEADER) token?: string) {
    return this.service.getForOwner(id, token);
  }

  /** QPay invoice үүсгэх (утас заавал) */
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post('attempts/:id/pay')
  @HttpCode(HttpStatus.OK)
  pay(
    @Param('id') id: string,
    @Body() dto: PayPlacementDto,
    @Headers(PLACEMENT_TOKEN_HEADER) token?: string,
  ) {
    return this.service.pay(id, token, dto);
  }

  /** Төлбөр шалгах (polling) — төлөгдсөн бол үр дүн нээгдэнэ */
  @Public()
  @Post('attempts/:id/check')
  @HttpCode(HttpStatus.OK)
  check(@Param('id') id: string, @Headers(PLACEMENT_TOKEN_HEADER) token?: string) {
    return this.service.check(id, token);
  }

  // ───────────── Админ ─────────────

  @Roles(Role.ADMIN)
  @Get('admin/attempts')
  adminList(@Query() query: ListAdminPlacementQueryDto) {
    return this.service.adminList(query);
  }

  @Roles(Role.ADMIN)
  @Post('admin/attempts/:id/recheck')
  @HttpCode(HttpStatus.OK)
  adminRecheck(@Param('id') id: string) {
    return this.service.adminRecheck(id);
  }

  @Roles(Role.ADMIN)
  @Post('admin/attempts/:id/confirm')
  @HttpCode(HttpStatus.OK)
  adminConfirm(@Param('id') id: string, @Body() dto: AdminConfirmPlacementDto) {
    return this.service.adminConfirm(id, dto);
  }
}
