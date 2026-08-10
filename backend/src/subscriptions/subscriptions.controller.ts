// backend/src/subscriptions/subscriptions.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { SubscriptionsService } from './subscriptions.service';
import {
  CreatePaymentDto,
  CreatePricingPlanDto,
  UpdatePricingPlanDto,
} from './dto/billing.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('me')
  getMine(@CurrentUser('userId') userId: string) {
    return this.subscriptionsService.getMine(userId);
  }

  @Public()
  @Get('plans')
  listPlans() {
    return this.subscriptionsService.listPublicPlans();
  }

  @Post('payments')
  createPayment(@CurrentUser('userId') userId: string, @Body() dto: CreatePaymentDto) {
    return this.subscriptionsService.createPayment(userId, dto);
  }

  @Get('payments')
  listPayments(@CurrentUser('userId') userId: string) {
    return this.subscriptionsService.listMyPayments(userId);
  }

  /** QPay callback — collection: ?payment_id=... */
  @Public()
  @Get('payments/qpay-callback')
  qpayCallbackGet(
    @Query('payment_id') paymentId?: string,
    @Query('paymentId') paymentIdCamel?: string,
    @Query('invoice_id') invoiceId?: string,
  ) {
    return this.subscriptionsService.handleQpayCallback(
      paymentId || paymentIdCamel,
      invoiceId,
    );
  }

  @Public()
  @Post('payments/qpay-callback')
  qpayCallbackPost(
    @Query('payment_id') paymentId?: string,
    @Query('paymentId') paymentIdCamel?: string,
    @Query('invoice_id') invoiceId?: string,
    @Body()
    body?: {
      payment_id?: string;
      paymentId?: string;
      invoice_id?: string;
      qPay_payment_id?: string;
    },
  ) {
    return this.subscriptionsService.handleQpayCallback(
      paymentId || paymentIdCamel || body?.payment_id || body?.paymentId,
      invoiceId || body?.invoice_id,
    );
  }

  @Get('payments/:id')
  getPayment(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.subscriptionsService.getPayment(userId, id);
  }

  @Post('payments/:id/check')
  checkPayment(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.subscriptionsService.checkAndActivate(id, userId);
  }

  @Roles(Role.ADMIN)
  @Get('admin/plans')
  adminListPlans() {
    return this.subscriptionsService.listAdminPlans();
  }

  @Roles(Role.ADMIN)
  @Put('admin/plans/:id')
  adminUpdatePlan(@Param('id') id: string, @Body() dto: UpdatePricingPlanDto) {
    return this.subscriptionsService.updatePlan(id, dto);
  }

  @Roles(Role.ADMIN)
  @Post('admin/plans')
  adminCreatePlan(@Body() dto: CreatePricingPlanDto) {
    return this.subscriptionsService.createPlan(dto);
  }

  @Roles(Role.ADMIN)
  @Delete('admin/plans/:id')
  adminDeletePlan(@Param('id') id: string) {
    return this.subscriptionsService.deletePlan(id);
  }

  @Post('upgrade-mock')
  upgradeMock(@CurrentUser('userId') userId: string) {
    return this.subscriptionsService.upgradeMock(userId);
  }
}
