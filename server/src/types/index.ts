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

export const imageSchema = z
  .object({
    asset_id: z.string(),
    public_id: z.string(),
    format: z.string(),
    resource_type: z.string(),
    type: z.string(),
    url: z.string(),
    secure_url: z.string(),
  })
  .strip();

export type Image = z.infer<typeof imageSchema>;

export const personalInfoSchema = z.object({
  first_name: z.string().min(1, { message: 'Please enter your first name.' }),
  last_name: z.string().min(1, { message: 'Please enter your last name.' }),
  dateOfBirth: z.coerce
    .date()
    .min(new Date(1900, 0, 1), { message: 'Please enter a valid date of birth.' })
    .max(new Date(), { message: 'Please enter a valid date of birth.' })
    .refine(
      (date) => {
        const ageDiffMs = Date.now() - date.getTime();
        const ageDate = new Date(ageDiffMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return age >= 18;
      },
      { message: 'You must be at least 18 years old.' }
    ),
  gender: z.union([
    z.literal('Male'),
    z.literal('Female'),
    z.literal('Other'),
    z.literal('PreferNotToSay'),
  ]),
  images: z.array(imageSchema).refine(
    (images) => {
      return images.reduce((acc, img) => (img.url.length > 0 ? acc + 1 : acc), 0) > 0;
    },
    { message: 'Please upload at least one image.' }
  ),
}).strip();

export type PersonalInfo = z.infer<typeof personalInfoSchema>;

export const basicInfoSchema = z.object({
  bio: z.string().max(500).optional(),
  languages: z.array(z.string()).optional(),
  zodiac: z.string().optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
}).strip();

export type BasicInfo = z.infer<typeof basicInfoSchema>;

export const otherInfoSchema = z.object({
  interests: z.array(z.string()).optional(),
  diet: z.string().optional(),
  drinking: z.string().optional(),
  smoking: z.string().optional(),
  pets: z.string().optional(),
  socialMediaActivity: z.string().optional(),
}).strip();

export type OtherInfo = z.infer<typeof otherInfoSchema>;

export const preferencesSchema = z.object({
  lookingFor: z.string(),
  attraction: z.string(),
  ageRange: z.object({
    min: z.number().min(18).max(100).default(18),
    max: z.number().min(18).max(100).default(100),
  }),
}).strip();

export type Preferences = z.infer<typeof preferencesSchema>;

export const userProfileSchema = z.object({
  personalInfo: personalInfoSchema,
  basicInfo: basicInfoSchema.optional(),
  otherInfo: otherInfoSchema.optional(),
  preferences: preferencesSchema,
});

export type UserProfile = z.infer<typeof userProfileSchema>;

