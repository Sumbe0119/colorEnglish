import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;

  constructor(private config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const port = this.config.get<string>('SMTP_PORT');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    this.from = this.config.get<string>('SMTP_FROM') ?? 'ColorEnglish <no-reply@colorenglish.mn>';

    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: { user, pass },
      });
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

    await this.transporter.sendMail({ from: this.from, to, subject, text, html });
  }
}
