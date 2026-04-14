import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.local",
});
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set.");
}
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
