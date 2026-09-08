// backend/src/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;

  constructor(private config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST')?.trim();
    const portRaw = this.config.get<string>('SMTP_PORT')?.trim();
    const user = this.config.get<string>('SMTP_USER')?.trim();
    const pass = this.config.get<string>('SMTP_PASS')?.trim();
    const fromEnv = this.config.get<string>('SMTP_FROM')?.trim();
    const port = Number(portRaw ?? 587);

    // Gmail: From нь SMTP_USER-тэй ижил байх ёстой (эсвэл Gmail-д verify хийсэн alias)
    this.from =
      fromEnv && fromEnv.length > 0
        ? fromEnv
        : user
          ? `ColorEnglish <${user}>`
          : 'ColorEnglish <no-reply@colorenglish.mn>';

    if (host && portRaw && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        requireTLS: port === 587,
        auth: { user, pass },
      });

      void this.transporter.verify().then(
        () => this.logger.log(`SMTP бэлэн: ${host}:${port} as ${user}`),
        (err: Error) =>
          this.logger.error(
            `SMTP холбогдохгүй байна (${host}:${port}). Gmail бол App Password шаардлагатай. ${err.message}`,
          ),
      );
    } else {
      this.transporter = null;
      this.logger.warn(
        'SMTP тохиргоо дутуу (SMTP_HOST/PORT/USER/PASS) — и-мэйл илгээгдэхгүй, console-д л бичигдэнэ',
      );
    }
  }

  async sendPasswordResetCode(to: string, code: string) {
    const subject = 'ColorEnglish — Нууц үг сэргээх код';
    const text = `Таны нууц үг сэргээх баталгаажуулах код: ${code}\n\nЭнэ код 10 минутын дараа хүчингүй болно. Хэрэв та энэ хүсэлтийг илгээгээгүй бол энэ и-мэйлийг үл тоомсорлоно уу.`;
    const html = `
      <p>Таны нууц үг сэргээх баталгаажуулах код:</p>
      <p style="font-size:24px;font-weight:700;letter-spacing:4px;">${code}</p>
      <p>Энэ код <strong>10 минутын</strong> дараа хүчингүй болно.</p>
      <p style="color:#6B7A94;font-size:12px;">Хэрэв та энэ хүсэлтийг илгээгээгүй бол энэ и-мэйлийг үл тоомсорлоно уу.</p>
    `;

    if (!this.transporter) {
      this.logger.log(`[DEV] ${to} рүү нууц үг сэргээх код: ${code}`);
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        text,
        html,
      });
      this.logger.log(`И-мэйл илгээгдлээ → ${to} (id: ${info.messageId})`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`И-мэйл илгээхэд алдаа (${to}): ${message}`);
      throw err;
    }
  }
}
