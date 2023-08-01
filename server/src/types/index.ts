import { z } from "zod";

export const sessionDataSchema = z.object({
  id: z.string(),
  email: z.string(),
  refreshToken: z.string(),
});

export type SessionData = z.infer<typeof sessionDataSchema>;

export const accessTokenSchema = z.object({
  access_token: z.string(),
  id_token: z.string()
}).strip()

export type AccessToken = z.infer<typeof accessTokenSchema>;

export const googleUserInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  picture: z.string(),
  email: z.string(),
  verified_email: z.boolean()
});

export type GoogleUserInfo = z.infer<typeof googleUserInfoSchema>;
