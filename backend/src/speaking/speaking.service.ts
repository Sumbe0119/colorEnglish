import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpeakingSessionDto, SendSpeakingMessageDto } from './speaking.dto';

@Injectable()
export class SpeakingService {
  constructor(private prisma: PrismaService) {}

  async listSessions(userId: string) {
    return this.prisma.speakingSession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      include: { _count: { select: { messages: true } } },
    });
  }

  async createSession(userId: string, dto: CreateSpeakingSessionDto) {
    return this.prisma.speakingSession.create({
      data: { userId, topic: dto.topic, levelCode: dto.levelCode },
    });
  }

  async getSession(userId: string, sessionId: string) {
    const session = await this.prisma.speakingSession.findFirst({
      where: { id: sessionId, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!session) throw new NotFoundException('Ярианы session олдсонгүй');
    return session;
  }

  async sendMessage(userId: string, sessionId: string, dto: SendSpeakingMessageDto) {
    const session = await this.prisma.speakingSession.findFirst({
      where: { id: sessionId, userId, endedAt: null },
    });
    if (!session) throw new NotFoundException('Session олдсонгүй эсвэл дууссан');

    const userMsg = await this.prisma.speakingMessage.create({
      data: {
        sessionId,
        role: 'user',
        content: dto.content,
        audioUrl: dto.audioUrl,
      },
    });

    // AI placeholder — ANTHROPIC_API_KEY тохируулахад солино
    const assistantMsg = await this.prisma.speakingMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: `Great effort! Here's a tip for "${dto.content.slice(0, 40)}...": Try using more natural connectors like "however" or "actually".`,
        corrections: {
          suggestions: [
            { original: dto.content, corrected: dto.content, explanation: 'Keep practicing!' },
          ],
        },
      },
    });

    return { userMessage: userMsg, assistantMessage: assistantMsg };
  }

  async endSession(userId: string, sessionId: string) {
    const session = await this.prisma.speakingSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundException('Session олдсонгүй');

    return this.prisma.speakingSession.update({
      where: { id: sessionId },
      data: { endedAt: new Date() },
    });
  }
}
