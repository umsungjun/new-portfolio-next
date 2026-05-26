import "dotenv/config";

import { defineConfig, env } from "prisma/config";

// Prisma 7부터 datasource URL이 schema.prisma에서 제거되고 이 파일로 이동.
// migrate CLI는 long-running 트랜잭션과 prepared statement를 사용하므로
// pgBouncer(transaction-mode pool)가 아닌 DIRECT 연결을 써야 함.
// runtime PrismaClient는 lib/server/prisma.ts에서 DATABASE_URL(pooled)을 별도 사용.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
