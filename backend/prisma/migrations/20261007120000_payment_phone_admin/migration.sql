-- Payment: payer phone, activation source, sweeper timestamp, admin note (idempotent for db-pushed envs)

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "phone" TEXT;

ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "payerPhone" TEXT;
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "activationSource" TEXT;
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "qpayCheckedAt" TIMESTAMP(3);
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "adminNote" TEXT;

CREATE INDEX IF NOT EXISTS "payments_status_createdAt_idx" ON "payments"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "payments_payerPhone_idx" ON "payments"("payerPhone");
