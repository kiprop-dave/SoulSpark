import z from 'zod';

export const loggedInUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  accessToken: z.string(),
  filledProfile: z.boolean(),
});

export type LoggedInUser = z.infer<typeof loggedInUserSchema>;
