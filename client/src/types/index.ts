import z from 'zod';

export const loggedInUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  accessToken: z.string(),
  filledProfile: z.boolean(),
});

export type LoggedInUser = z.infer<typeof loggedInUserSchema>;

export const credentialsSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

export type Credentials = z.infer<typeof credentialsSchema>;

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
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;

export const basicInfoSchema = z.object({
  bio: z.string().max(500).optional(),
  languages: z.array(z.string()).optional(),
  zodiac: z.string().optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
});

export type BasicInfo = z.infer<typeof basicInfoSchema>;

export const otherInfoSchema = z.object({
  interests: z.array(z.string()).optional(),
  diet: z.string().optional(),
  drinking: z.string().optional(),
  smoking: z.string().optional(),
  pets: z.string().optional(),
  socialMediaActivity: z.string().optional(),
});

export type OtherInfo = z.infer<typeof otherInfoSchema>;

export const preferencesSchema = z.object({
  lookingFor: z.string().optional(),
  attraction: z.string().optional(),
  ageRange: z.object({
    min: z.number().min(18).max(100).default(18),
    max: z.number().min(18).max(100).default(100),
  }),
});

export type Preferences = z.infer<typeof preferencesSchema>;

export const userProfileSchema = z.object({
  personalInfo: personalInfoSchema,
  basicInfo: basicInfoSchema.optional(),
  otherInfo: otherInfoSchema.optional(),
  preferences: preferencesSchema,
});

export type UserProfile = z.infer<typeof userProfileSchema>;
