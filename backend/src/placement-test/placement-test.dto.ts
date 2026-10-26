// backend/src/placement-test/placement-test.dto.ts
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class PlacementAnswerDto {
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  questionId!: string;

  /** Сонгосон хариултын индекс (options дотор) */
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(9)
  choice!: number;
}

export class SubmitPlacementDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => PlacementAnswerDto)
  answers!: PlacementAnswerDto[];

  /** Тест өгөхөд зарцуулсан секунд (мэдээллийн зорилгоор) */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(86_400)
  durationSec?: number;
}

export class PayPlacementDto {
  /** Төлөгчийн утас — QPay гүйлгээг "COLORENGLISH TEST <утас>"-аар таних */
  @IsString()
  @Matches(/^\d{8}$/, { message: 'Утасны дугаар 8 оронтой тоо байх ёстой' })
  phone!: string;
}

export const ADMIN_PLACEMENT_STATUSES = [
  'all',
  'PAID',
  'PENDING',
  'UNPAID',
  'EXPIRED',
  'FAILED',
  'CANCELED',
] as const;
export type AdminPlacementStatusFilter = (typeof ADMIN_PLACEMENT_STATUSES)[number];

export class ListAdminPlacementQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  /** Утас / invoice / и-мэйлээр хайх */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  /** all | PAID | PENDING (invoice-тэй) | UNPAID (төлбөр эхлээгүй) | EXPIRED | FAILED | CANCELED */
  @IsOptional()
  @IsIn(ADMIN_PLACEMENT_STATUSES)
  status?: AdminPlacementStatusFilter;
}
