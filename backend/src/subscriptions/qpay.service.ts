// backend/src/subscriptions/qpay.service.ts
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * QPay Merchant API v2 — Postman "api test v2" collection-тай нийцүүлсэн.
 * Auth: Basic (client_id / client_secret) → Bearer access_token
 * Docs flow: token → invoice (simple) → payment/check
 */

type QpayToken = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expiresAt: number;
};

export type QpayInvoiceResponse = {
  invoice_id: string;
  qr_text?: string;
  qr_image?: string;
  qPay_shortUrl?: string;
  urls?: Array<{ name: string; description?: string; logo?: string; link: string }>;
};

export type QpayCheckResponse = {
  count: number;
  paid_amount?: number;
  rows?: Array<{
    payment_id?: string;
    payment_status?: string;
    payment_amount?: string | number;
    payment_currency?: string;
    payment_wallet?: string;
    payment_type?: string;
  }>;
};

@Injectable()
export class QpayService {
  private readonly logger = new Logger(QpayService.name);
  private token: QpayToken | null = null;

  constructor(private config: ConfigService) {}

  private get baseUrl() {
    return (this.config.get<string>('QPAY_BASE_URL') || 'https://merchant.qpay.mn').replace(/\/$/, '');
  }

  /** client_id */
  private get username() {
    return this.config.get<string>('QPAY_USERNAME') || '';
  }

  /** client_secret */
  private get password() {
    return this.config.get<string>('QPAY_PASSWORD') || '';
  }

  get invoiceCode() {
    return this.config.get<string>('QPAY_INVOICE_CODE') || '';
  }

  /** Optional — collection "Create simple" дээр sender_branch_code */
  private get branchCode() {
    return this.config.get<string>('QPAY_BRANCH_CODE') || '';
  }

  isConfigured() {
    return Boolean(this.username && this.password && this.invoiceCode);
  }

  private assertConfigured() {
    if (!this.isConfigured()) {
      throw new ServiceUnavailableException(
        'QPay тохиргоо дутуу (QPAY_USERNAME, QPAY_PASSWORD, QPAY_INVOICE_CODE)',
      );
    }
  }

  private storeToken(data: {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  }) {
    const expiresInMs = (data.expires_in ?? 3600) * 1000;
    this.token = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      expiresAt: Date.now() + expiresInMs,
    };
  }

  /** POST /v2/auth/token — Basic Auth, empty body */
  private async fetchNewToken(): Promise<string> {
    this.assertConfigured();
    const basic = Buffer.from(`${this.username}:${this.password}`).toString('base64');
    const res = await fetch(`${this.baseUrl}/v2/auth/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/json',
      },
      body: '',
    });

    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`QPay auth failed: ${res.status} ${text}`);
      throw new ServiceUnavailableException('QPay нэвтрэлт амжилтгүй');
    }

    const data = (await res.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
    };
    this.storeToken(data);
    return this.token!.access_token;
  }

  /** POST /v2/auth/refresh — Bearer refresh_token */
  private async refreshAccessToken(): Promise<string | null> {
    if (!this.token?.refresh_token) return null;
    const res = await fetch(`${this.baseUrl}/v2/auth/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token.refresh_token}`,
        'Content-Type': 'application/json',
      },
      body: '',
    });
    if (!res.ok) {
      this.logger.warn(`QPay refresh failed: ${res.status}`);
      this.token = null;
      return null;
    }
    const data = (await res.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
    };
    this.storeToken({
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? this.token.refresh_token,
      expires_in: data.expires_in,
    });
    return this.token!.access_token;
  }

  private async getAccessToken(): Promise<string> {
    if (this.token && this.token.expiresAt > Date.now() + 30_000) {
      return this.token.access_token;
    }
    if (this.token?.refresh_token) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) return refreshed;
    }
    return this.fetchNewToken();
  }

  private async authorizedFetch(path: string, init: RequestInit, retry = true): Promise<Response> {
    const token = await this.getAccessToken();
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${token}`);
    if (!headers.has('Content-Type') && init.method && init.method !== 'GET' && init.method !== 'DELETE') {
      headers.set('Content-Type', 'application/json');
    }
    const res = await fetch(`${this.baseUrl}${path}`, { ...init, headers });
    if (res.status === 401 && retry) {
      this.token = null;
      await this.fetchNewToken();
      return this.authorizedFetch(path, init, false);
    }
    return res;
  }

  /**
   * POST /v2/invoice — Create simple (collection)
   * invoice_receiver_code: "terminal"
   */
  async createInvoice(input: {
    senderInvoiceNo: string;
    amount: number;
    description: string;
    callbackUrl: string;
  }): Promise<QpayInvoiceResponse> {
    const body: Record<string, unknown> = {
      invoice_code: this.invoiceCode,
      sender_invoice_no: input.senderInvoiceNo,
      invoice_receiver_code: 'terminal',
      invoice_description: input.description,
      amount: input.amount,
      callback_url: input.callbackUrl,
    };
    if (this.branchCode) {
      body.sender_branch_code = this.branchCode;
    }

    const res = await this.authorizedFetch('/v2/invoice', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`QPay create invoice failed: ${res.status} ${text}`);
      throw new ServiceUnavailableException(`QPay invoice үүсгэж чадсангүй: ${text.slice(0, 200)}`);
    }

    return (await res.json()) as QpayInvoiceResponse;
  }

  /** DELETE /v2/invoice/{invoice_id} */
  async cancelInvoice(invoiceId: string): Promise<void> {
    const res = await this.authorizedFetch(`/v2/invoice/${invoiceId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`QPay cancel invoice failed: ${res.status} ${text}`);
      throw new ServiceUnavailableException('QPay invoice цуцлахад алдаа гарлаа');
    }
  }

  /**
   * POST /v2/payment/check
   * object_type=INVOICE, object_id=invoice_id
   */
  async checkInvoice(invoiceId: string): Promise<QpayCheckResponse> {
    const res = await this.authorizedFetch('/v2/payment/check', {
      method: 'POST',
      body: JSON.stringify({
        object_type: 'INVOICE',
        object_id: invoiceId,
        offset: {
          page_number: 1,
          page_limit: 100,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`QPay check failed: ${res.status} ${text}`);
      throw new ServiceUnavailableException('QPay төлбөр шалгалт амжилтгүй');
    }

    return (await res.json()) as QpayCheckResponse;
  }

  /** GET /v2/payment/{payment_id} */
  async getPayment(paymentId: string): Promise<unknown> {
    const res = await this.authorizedFetch(`/v2/payment/${paymentId}`, {
      method: 'GET',
    });
    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`QPay get payment failed: ${res.status} ${text}`);
      throw new ServiceUnavailableException('QPay төлбөрийн мэдээлэл авч чадсангүй');
    }
    return res.json();
  }
}
