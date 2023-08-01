import { object, string } from "zod";

const envSchema = object({
  PORT: string().default("3000"),
  DATABASE_URL: string().url(),
  REDIS_URL: string().url(),
  ACCESS_TOKEN_SECRET: string(),
  REFRESH_TOKEN_SECRET: string(),
  GOOGLE_CLIENT_SECRET: string(),
  GOOGLE_CLIENT_ID: string()
});

export const env = envSchema.parse(process.env);
