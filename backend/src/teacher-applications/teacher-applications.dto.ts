// backend/src/teacher-applications/teacher-applications.dto.ts
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
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
import { TeacherApplicationStatus } from '@prisma/client';

const Trim = () => Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));
/** '' → undefined (заавал биш талбаруудад хоосон мөр ирэхэд) */
const EmptyToUndefined = () =>
  Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? undefined : value));

const PHONE_MESSAGE = 'Утасны дугаар 8 оронтой тоо байх ёстой';
const TEXT_MAX = 4000;

const Short = (max: number) => [Trim(), IsString(), MaxLength(max)];
function applyAll(...decorators: PropertyDecorator[][]): PropertyDecorator {
  const flat = decorators.flat();
  return (target, key) => flat.forEach((d) => d(target, key));
}
const OptionalShort = (max: number) => applyAll([EmptyToUndefined(), IsOptional()], Short(max));
const RequiredShort = (max: number, message: string) =>
  applyAll(Short(max), [MinLength(1, { message })]);

export class EducationDto {
  @RequiredShort(150, 'Сургуулийн нэрээ бичнэ үү')
  school!: string;

  @OptionalShort(150)
  major?: string;

  /** Жишээ: 2015–2019 */
  @OptionalShort(40)
  period?: string;
}

export class ExperienceDto {
  @RequiredShort(150, 'Байгууллагын нэрээ бичнэ үү')
  company!: string;

  @OptionalShort(150)
  position?: string;

  @OptionalShort(40)
  period?: string;

  @OptionalShort(2000)
  description?: string;
}

export class AwardDto {
  @RequiredShort(300, 'Шагналын нэрээ бичнэ үү')
  title!: string;

  @OptionalShort(20)
  year?: string;
}

export class LanguageScoreDto {
  /** IELTS, TOEFL, TOPIK г.м. */
  @RequiredShort(60, 'Шалгалтын нэрээ бичнэ үү')
  test!: string;

  @RequiredShort(30, 'Оноогоо бичнэ үү')
  score!: string;

  @OptionalShort(20)
  year?: string;
}

export class OtherLanguageDto {
  /** Жишээ: Орос, Хятад, Япон */
  @RequiredShort(60, 'Хэлний нэрээ бичнэ үү')
  language!: string;

  /** Жишээ: B2, Дунд шат, Эх хэл */
  @RequiredShort(40, 'Түвшингээ бичнэ үү')
  level!: string;
}

export class CreateTeacherApplicationDto {
  @Trim()
  @IsString()
  @MinLength(1, { message: 'Овгоо оруулна уу' })
  @MaxLength(60)
  lastName!: string;

  @Trim()
  @IsString()
  @MinLength(1, { message: 'Нэрээ оруулна уу' })
  @MaxLength(60)
  firstName!: string;

  @Trim()
  @IsString()
  @Matches(/^\d{8}$/, { message: PHONE_MESSAGE })
  phone!: string;

  @EmptyToUndefined()
  @IsOptional()
  @Trim()
  @IsEmail({}, { message: 'И-мэйл хаяг буруу байна' })
  @MaxLength(120)
  email?: string;

  /** Холбоо барих (ойрын) хүний нэр */
  @EmptyToUndefined()
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(60)
  contactName?: string;

  /** Холбоо барих хүний дугаар */
  @Trim()
  @IsString()
  @Matches(/^\d{8}$/, { message: `Холбоо барих хүний ${PHONE_MESSAGE.toLowerCase()}` })
  contactPhone!: string;

  /** YYYY-MM-DD */
  @Trim()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Төрсөн огноо YYYY-MM-DD хэлбэртэй байна' })
  birthDate!: string;

  /** /photo endpoint-оос ирсэн url — зөвхөн манай teacher-photos зам */
  @Trim()
  @IsString()
  @Matches(/^\/api\/uploads\/teacher-photos\/[A-Za-z0-9-]+\.(jpg|jpeg|png|webp|gif)$/, {
    message: 'Цээж зургаа оруулна уу',
  })
  photoUrl!: string;

  /** Өөрийн тухай дэлгэрэнгүй */
  @Trim()
  @IsString()
  @MinLength(1, { message: 'Өөрийнхөө тухай бичнэ үү' })
  @MaxLength(TEXT_MAX)
  aboutMe!: string;

  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => OtherLanguageDto)
  otherLanguages!: OtherLanguageDto[];

  @OptionalShort(100)
  instagram?: string;

  @OptionalShort(100)
  facebook?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Боловсролоо нэмнэ үү' })
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  educations!: EducationDto[];

  @IsArray()
  @ArrayMaxSize(15)
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experiences!: ExperienceDto[];

  @IsArray()
  @ArrayMaxSize(15)
  @ValidateNested({ each: true })
  @Type(() => AwardDto)
  awards!: AwardDto[];

  /** Мэргэжлийн хэлний оноо байгаа эсэх */
  @IsBoolean({ message: 'Хэлний оноо байгаа эсэхээ сонгоно уу' })
  hasLanguageScore!: boolean;

  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => LanguageScoreDto)
  languageScores!: LanguageScoreDto[];

  @Trim()
  @IsString()
  @MinLength(1, { message: 'Хоббигоо бичнэ үү' })
  @MaxLength(TEXT_MAX)
  hobbies!: string;

  /** Ойрын 5 жилийн сонирхол, зорилго */
  @Trim()
  @IsString()
  @MinLength(1, { message: 'Ойрын 5 жилийн сонирхлоо бичнэ үү' })
  @MaxLength(TEXT_MAX)
  fiveYearGoals!: string;

  /** Контент хийх сонирхолтой эсэх */
  @IsBoolean({ message: 'Контент хийх сонирхолтой эсэхээ сонгоно уу' })
  contentInterest!: boolean;

  /** Яагаад (тийм/үгүй аль ч тохиолдолд) */
  @Trim()
  @IsString()
  @MinLength(1, { message: 'Шалтгаанаа бичнэ үү' })
  @MaxLength(TEXT_MAX)
  contentReason!: string;

  @EmptyToUndefined()
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(TEXT_MAX)
  note?: string;
}

export const ADMIN_TEACHER_STATUSES = ['all', ...Object.values(TeacherApplicationStatus)] as const;
export type AdminTeacherStatusFilter = (typeof ADMIN_TEACHER_STATUSES)[number];

export class ListAdminTeacherApplicationsQueryDto {
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

  /** Нэр / утас / и-мэйлээр хайх */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @IsOptional()
  @IsIn(ADMIN_TEACHER_STATUSES)
  status?: AdminTeacherStatusFilter;
}

export class UpdateAdminTeacherApplicationDto {
  @IsOptional()
  @IsIn(Object.values(TeacherApplicationStatus))
  status?: TeacherApplicationStatus;

  /** null → тэмдэглэл устгана */
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(2000)
  adminNote?: string | null;
}
