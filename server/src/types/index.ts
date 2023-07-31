import { z } from "zod";

export const sessionDataSchema = z.object({
  id: z.string(),
  email: z.string(),
  refreshToken: z.string(),
});

export type SessionData = z.infer<typeof sessionDataSchema>;
