import { object, string } from 'zod';

const envSchema = object({
  PORT: string().default('3000'),
  DATABASE_URL: string().url(),
  REDIS_URL: string().url(),
  ACCESS_TOKEN_SECRET: string(),
  REFRESH_TOKEN_SECRET: string(),
  GOOGLE_CLIENT_SECRET: string(),
  GOOGLE_CLIENT_ID: string(),
  FACEBOOK_CLIENT_SECRET: string(),
  FACEBOOK_CLIENT_ID: string(),
  PUSHER_APP_ID: string(),
  PUSHER_KEY: string(),
  PUSHER_SECRET: string(),
  CLOUDINARY_CLOUD_NAME: string(),
  CLOUDINARY_API_KEY: string(),
  CLOUDINARY_API_SECRET: string(),
  TENOR_API_KEY: string(),
  EDEN_AI_API_KEY: string(),
});

export const env = envSchema.parse(process.env);
