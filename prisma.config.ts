import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: "postgresql://postgres.ogjzjwgavwtrgfzumeky:Siyantech2026@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  },
});
