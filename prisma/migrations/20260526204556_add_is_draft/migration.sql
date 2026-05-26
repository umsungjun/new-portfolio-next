-- 운영 DB에는 이미 ALTER TABLE이 직접 적용된 상태(Supabase SQL Editor에서 수동 실행).
-- 새 환경에서는 정상 생성되고, 운영 DB에서 migrate deploy가 재실행되더라도 충돌하지 않도록 IF NOT EXISTS 사용.

-- AlterTable
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "isDraft" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN IF NOT EXISTS "isDraft" BOOLEAN NOT NULL DEFAULT false;
