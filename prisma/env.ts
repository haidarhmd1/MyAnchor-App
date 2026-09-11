import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.local",
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set.");
}
