import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { ProgressModule } from './progress/progress.module';
import { ExamsModule } from './exams/exams.module';
import { SpeakingModule } from './speaking/speaking.module';
import { WritingModule } from './writing/writing.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { ReadingModule } from './reading/reading.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    ProfileModule,
    CurriculumModule,
    ProgressModule,
    ExamsModule,
    SpeakingModule,
    WritingModule,
    VocabularyModule,
    SubscriptionsModule,
    NotificationsModule,
    AdminModule,
    ReadingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
