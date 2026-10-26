// backend/src/teacher-applications/teacher-applications.service.ts
// Багшаар ажиллах хүсэлт (CV): footer-оос нэвтрэхгүй илгээнэ → админ жагсаалт/дэлгэрэнгүй/төлөв.
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, TeacherApplication, TeacherApplicationStatus } from '@prisma/client';
import { existsSync, promises as fs } from 'fs';
import { basename, join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { TEACHER_PHOTOS_DIR } from '../uploads/uploads.paths';
import { TEACHER_PHOTO_URL_PREFIX } from '../uploads/teacher-photo-upload';
import {
  CreateTeacherApplicationDto,
  ListAdminTeacherApplicationsQueryDto,
  UpdateAdminTeacherApplicationDto,
} from './teacher-applications.dto';

const MIN_AGE = 16;
const MAX_AGE = 80;

/** Нэг утаснаас нэг хоногт хэд илгээж болох (давхардал, спамаас хамгаална) */
const MAX_PER_PHONE_PER_DAY = 3;

@Injectable()
export class TeacherApplicationsService {
  private readonly logger = new Logger(TeacherApplicationsService.name);

  constructor(private prisma: PrismaService) {}

  // ───────────── Зочин ─────────────

  async create(dto: CreateTeacherApplicationDto) {
    const birthDate = parseBirthDate(dto.birthDate);

    const photoFile = basename(dto.photoUrl);
    if (!dto.photoUrl.startsWith(TEACHER_PHOTO_URL_PREFIX) || !existsSync(join(TEACHER_PHOTOS_DIR, photoFile))) {
      throw new BadRequestException('Цээж зураг олдсонгүй. Зургаа дахин оруулна уу');
    }

    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recent = await this.prisma.teacherApplication.count({
      where: { phone: dto.phone, createdAt: { gte: dayAgo } },
    });
    if (recent >= MAX_PER_PHONE_PER_DAY) {
      throw new BadRequestException('Энэ дугаараас өнөөдөр хүсэлт илгээсэн байна. Бид тантай холбогдох болно.');
    }

    const row = await this.prisma.teacherApplication.create({
      data: {
        lastName: dto.lastName,
        firstName: dto.firstName,
        phone: dto.phone,
        email: dto.email ?? null,
        contactName: dto.contactName ?? null,
        contactPhone: dto.contactPhone,
        birthDate,
        photoUrl: `${TEACHER_PHOTO_URL_PREFIX}${photoFile}`,
        aboutMe: dto.aboutMe,
        otherLanguages: dto.otherLanguages as unknown as Prisma.InputJsonValue,
        instagram: dto.instagram ?? null,
        facebook: dto.facebook ?? null,
        educations: dto.educations as unknown as Prisma.InputJsonValue,
        experiences: dto.experiences as unknown as Prisma.InputJsonValue,
        awards: dto.awards as unknown as Prisma.InputJsonValue,
        hasLanguageScore: dto.hasLanguageScore,
        languageScores: (dto.hasLanguageScore ? dto.languageScores : []) as unknown as Prisma.InputJsonValue,
        hobbies: dto.hobbies,
        fiveYearGoals: dto.fiveYearGoals,
        contentInterest: dto.contentInterest,
        contentReason: dto.contentReason,
        note: dto.note ?? null,
      },
    });
    this.logger.log(`Шинэ багшийн CV: ${row.id} (${row.lastName} ${row.firstName}, ${row.phone})`);
    return { id: row.id, createdAt: row.createdAt };
  }

  // ───────────── Админ ─────────────

  async adminList(query: ListAdminTeacherApplicationsQueryDto = {}) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    const and: Prisma.TeacherApplicationWhereInput[] = [];
    const q = query.q?.trim();
    if (q) {
      and.push({
        OR: [
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q } },
          { contactPhone: { contains: q } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      });
    }
    if (query.status && query.status !== 'all') {
      and.push({ status: query.status as TeacherApplicationStatus });
    }
    const where: Prisma.TeacherApplicationWhereInput = and.length ? { AND: and } : {};

    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const [rows, total, allCount, newCount, todayCount, acceptedCount] = await Promise.all([
      this.prisma.teacherApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.teacherApplication.count({ where }),
      this.prisma.teacherApplication.count(),
      this.prisma.teacherApplication.count({ where: { status: TeacherApplicationStatus.NEW } }),
      this.prisma.teacherApplication.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.teacherApplication.count({ where: { status: TeacherApplicationStatus.ACCEPTED } }),
    ]);

    return {
      items: rows.map(toAdminItem),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      stats: { total: allCount, newCount, todayCount, acceptedCount },
    };
  }

  async adminGet(id: string) {
    const row = await this.prisma.teacherApplication.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Хүсэлт олдсонгүй');
    return toAdminItem(row);
  }

  async adminUpdate(id: string, dto: UpdateAdminTeacherApplicationDto) {
    const existing = await this.prisma.teacherApplication.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Хүсэлт олдсонгүй');

    const data: Prisma.TeacherApplicationUpdateInput = {};
    if (dto.status !== undefined && dto.status !== existing.status) {
      data.status = dto.status;
      if (dto.status !== TeacherApplicationStatus.NEW && !existing.reviewedAt) data.reviewedAt = new Date();
    }
    if (dto.adminNote !== undefined) data.adminNote = dto.adminNote?.trim() ? dto.adminNote.trim() : null;

    const row = Object.keys(data).length
      ? await this.prisma.teacherApplication.update({ where: { id }, data })
      : existing;
    return toAdminItem(row);
  }

  async adminDelete(id: string) {
    const existing = await this.prisma.teacherApplication.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Хүсэлт олдсонгүй');
    await this.prisma.teacherApplication.delete({ where: { id } });

    // Зургийг best-effort устгана (өөр хүсэлт ижил файл ашиглахгүй — UUID нэртэй)
    const file = join(TEACHER_PHOTOS_DIR, basename(existing.photoUrl));
    await fs.unlink(file).catch(() => undefined);
    return { id, deleted: true };
  }
}

function parseBirthDate(value: string) {
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const valid =
    Number.isFinite(date.getTime()) &&
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d;
  if (!valid) throw new BadRequestException('Төрсөн огноо буруу байна');

  const age = calcAge(date);
  if (age < MIN_AGE || age > MAX_AGE) {
    throw new BadRequestException(`Төрсөн огноо буруу байна (${MIN_AGE}–${MAX_AGE} насны хооронд)`);
  }
  return date;
}

export function calcAge(birthDate: Date, now = new Date()) {
  let age = now.getUTCFullYear() - birthDate.getUTCFullYear();
  const beforeBirthday =
    now.getUTCMonth() < birthDate.getUTCMonth() ||
    (now.getUTCMonth() === birthDate.getUTCMonth() && now.getUTCDate() < birthDate.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

function toAdminItem(r: TeacherApplication) {
  return {
    id: r.id,
    lastName: r.lastName,
    firstName: r.firstName,
    fullName: `${r.lastName} ${r.firstName}`.trim(),
    phone: r.phone,
    email: r.email,
    contactName: r.contactName,
    contactPhone: r.contactPhone,
    /** YYYY-MM-DD */
    birthDate: r.birthDate.toISOString().slice(0, 10),
    age: calcAge(r.birthDate),
    photoUrl: r.photoUrl,
    aboutMe: r.aboutMe,
    otherLanguages: r.otherLanguages ?? [],
    instagram: r.instagram,
    facebook: r.facebook,
    educations: r.educations ?? [],
    experiences: r.experiences ?? [],
    awards: r.awards ?? [],
    hasLanguageScore: r.hasLanguageScore,
    languageScores: r.languageScores ?? [],
    /** Хуучин нэг талбартай хүсэлтүүд (шинэд null) */
    legacyEducation: r.education,
    legacyExperience: r.experience,
    hobbies: r.hobbies,
    fiveYearGoals: r.fiveYearGoals,
    contentInterest: r.contentInterest,
    contentReason: r.contentReason,
    note: r.note,
    status: r.status,
    adminNote: r.adminNote,
    reviewedAt: r.reviewedAt,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}
