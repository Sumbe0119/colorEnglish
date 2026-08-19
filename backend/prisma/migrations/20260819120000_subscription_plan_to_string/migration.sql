-- AlterEnum → String: SubscriptionPlan-ийг TEXT болгоно (VIP_* custom code зөвшөөрнө)

-- subscriptions.plan
ALTER TABLE "subscriptions" ALTER COLUMN "plan" DROP DEFAULT;
ALTER TABLE "subscriptions" ALTER COLUMN "plan" TYPE TEXT USING ("plan"::text);
ALTER TABLE "subscriptions" ALTER COLUMN "plan" SET DEFAULT 'FREE';

-- pricing_plans.code
ALTER TABLE "pricing_plans" ALTER COLUMN "code" TYPE TEXT USING ("code"::text);

-- payments.planCode
ALTER TABLE "payments" ALTER COLUMN "planCode" TYPE TEXT USING ("planCode"::text);

-- Enum төрлийг устгана
DROP TYPE "SubscriptionPlan";
