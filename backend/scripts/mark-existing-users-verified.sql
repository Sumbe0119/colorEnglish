-- И-мэйл баталгаажуулалт нэвтрүүлэхээс ӨМНӨ бүртгүүлсэн хэрэглэгчдийг баталгаажсан гэж тэмдэглэнэ.
-- Үгүй бол тэд нэвтрэх бүрт код шаардана (код ирэх учраас гацахгүй ч, шаардлагагүй саад).
--
-- Ажиллуулах (prod):
--   cd backend
--   npx dotenv -e .env.prod -- npx prisma db push          # email_verification_codes хүснэгт үүсгэнэ
--   npx dotenv -e .env.prod -- npx prisma db execute --file scripts/mark-existing-users-verified.sql
UPDATE "users"
SET "isEmailVerified" = true
WHERE "isEmailVerified" = false
  AND "createdAt" < NOW();
