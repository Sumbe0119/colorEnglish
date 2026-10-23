-- Түвшин тогтоох тест — зочны оролдлого + QPay төлбөр (үр дүн төлбөрөөр нээгдэнэ)
-- (DB-г db push-оор үүсгэсэн орчинд давхар ажиллуулж болохоор idempotent)

-- CreateTable
CREATE TABLE IF NOT EXISTS "placement_tests" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT,
    "bankVersion" INTEGER NOT NULL DEFAULT 1,
    "answers" JSONB NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "scorePercent" INTEGER NOT NULL,
    "level" "LevelCode" NOT NULL,
    "levelKey" TEXT NOT NULL,
    "breakdown" JSONB NOT NULL,
    "durationSec" INTEGER,
    "amountMnt" INTEGER NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "senderInvoiceNo" TEXT,
    "qpayInvoiceId" TEXT,
    "qpayPaymentId" TEXT,
    "qrImage" TEXT,
    "qrText" TEXT,
    "shortUrl" TEXT,
    "urlsJson" JSONB,
    "payerPhone" TEXT,
    "paidAt" TIMESTAMP(3),
    "activationSource" TEXT,
    "qpayCheckedAt" TIMESTAMP(3),
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "placement_tests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "placement_tests_tokenHash_key" ON "placement_tests"("tokenHash");
CREATE UNIQUE INDEX IF NOT EXISTS "placement_tests_senderInvoiceNo_key" ON "placement_tests"("senderInvoiceNo");
CREATE INDEX IF NOT EXISTS "placement_tests_paymentStatus_createdAt_idx" ON "placement_tests"("paymentStatus", "createdAt");
CREATE INDEX IF NOT EXISTS "placement_tests_qpayInvoiceId_idx" ON "placement_tests"("qpayInvoiceId");
CREATE INDEX IF NOT EXISTS "placement_tests_payerPhone_idx" ON "placement_tests"("payerPhone");
CREATE INDEX IF NOT EXISTS "placement_tests_userId_idx" ON "placement_tests"("userId");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "placement_tests" ADD CONSTRAINT "placement_tests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
