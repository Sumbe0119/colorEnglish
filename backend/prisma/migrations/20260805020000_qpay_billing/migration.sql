-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'CANCELED', 'EXPIRED', 'FAILED');

-- CreateTable
CREATE TABLE "pricing_plans" (
    "id" TEXT NOT NULL,
    "code" "SubscriptionPlan" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceMnt" INTEGER NOT NULL,
    "discountPercent" INTEGER NOT NULL DEFAULT 0,
    "durationDays" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "planCode" "SubscriptionPlan" NOT NULL,
    "amountMnt" INTEGER NOT NULL,
    "listPriceMnt" INTEGER NOT NULL,
    "discountPercent" INTEGER NOT NULL DEFAULT 0,
    "durationDays" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "senderInvoiceNo" TEXT NOT NULL,
    "qpayInvoiceId" TEXT,
    "qpayPaymentId" TEXT,
    "qrImage" TEXT,
    "qrText" TEXT,
    "shortUrl" TEXT,
    "urlsJson" JSONB,
    "paidAt" TIMESTAMP(3),
    "subscriptionEnds" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pricing_plans_code_key" ON "pricing_plans"("code");

-- CreateIndex
CREATE UNIQUE INDEX "payments_senderInvoiceNo_key" ON "payments"("senderInvoiceNo");

-- CreateIndex
CREATE INDEX "payments_userId_createdAt_idx" ON "payments"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "payments_qpayInvoiceId_idx" ON "payments"("qpayInvoiceId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_planId_fkey" FOREIGN KEY ("planId") REFERENCES "pricing_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed default plans
INSERT INTO "pricing_plans" ("id", "code", "name", "description", "priceMnt", "discountPercent", "durationDays", "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES
  ('plan_pro_monthly', 'PRO_MONTHLY', 'Pro сар', 'Бүх өгүүллэг + тоглоом — 30 хоног', 19900, 0, 30, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_pro_yearly', 'PRO_YEARLY', 'Pro жил', 'Бүх өгүүллэг + тоглоом — 365 хоног', 169900, 10, 365, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
