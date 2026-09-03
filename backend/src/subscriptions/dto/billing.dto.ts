// backend/src/subscriptions/dto/billing.dto.ts
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @MinLength(1)
  planId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  promoCode?: string;
}

export class ValidatePromoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  code!: string;

  @IsOptional()
  @IsString()
  planId?: string;
}

export class CreateDiscountCodeDto {
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: 'Код зөвхөн үсэг, тоо, _ - байж болно',
  })
  code!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  discountPercent!: number;

  @IsOptional()
  @IsString()
  startsAt?: string;

  @IsOptional()
  @IsString()
  expiresAt?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxUses?: number | null;

  @IsOptional()
  @IsBoolean()
  onePerUser?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  note?: string | null;
}

export class UpdateDiscountCodeDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  discountPercent?: number;

  @IsOptional()
  @IsString()
  startsAt?: string;

  @IsOptional()
  @IsString()
  expiresAt?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxUses?: number | null;

  @IsOptional()
  @IsBoolean()
  onePerUser?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  note?: string | null;
}

export class UpdatePricingPlanDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(100)
  priceMnt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationDays?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}

export class CreatePricingPlanDto {
  /** Жишээ: VIP_1_MONTH, CUSTOM_90 */
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @Matches(/^[A-Z][A-Z0-9_]*$/, {
    message: 'code зөвхөн том үсэг, тоо, _ байх ёстой (жишээ: VIP_1_MONTH)',
  })
  code!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @Type(() => Number)
  @IsInt()
  @Min(100)
  priceMnt!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationDays!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}
