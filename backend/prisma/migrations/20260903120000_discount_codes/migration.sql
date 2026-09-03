-- CreateTable
CREATE TABLE "discount_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountPercent" INTEGER NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "maxUses" INTEGER,
    "onePerUser" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discount_codes_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "payments" ADD COLUMN "promoDiscountPercent" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "payments" ADD COLUMN "promoCodeId" TEXT;
ALTER TABLE "payments" ADD COLUMN "promoCodeValue" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "discount_codes_code_key" ON "discount_codes"("code");
CREATE INDEX "discount_codes_isActive_expiresAt_idx" ON "discount_codes"("isActive", "expiresAt");
CREATE INDEX "payments_promoCodeId_idx" ON "payments"("promoCodeId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "discount_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
