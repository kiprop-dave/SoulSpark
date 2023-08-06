import z from 'zod';

export const loggedInUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  accessToken: z.string(),
  filledProfile: z.boolean(),
});

export type LoggedInUser = z.infer<typeof loggedInUserSchema>;

export const personalInfoSchema = z.object({
  first_name: z.string().min(1, { message: 'Please enter your first name.' }),
  last_name: z.string().min(1, { message: 'Please enter your last name.' }),
  dateOfBirth: z
    .coerce.date()
    .min(new Date(1900, 0, 1), { message: 'Please enter a valid date of birth.' })
    .max(new Date(), { message: 'Please enter a valid date of birth.' })
    .refine((date) => {
      const ageDiffMs = Date.now() - date.getTime();
      const ageDate = new Date(ageDiffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      return age >= 18;
    }, { message: 'You must be at least 18 years old.' }),
  gender: z.union([
    z.literal('Male'),
    z.literal('Female'),
    z.literal('Other'),
    z.literal('Prefer not to say'),
  ]),
  images: z.array(z.string()).refine((images) => {
    return images.reduce((acc, img) => img.length > 0 ? acc + 1 : acc, 0) >= 1;
  }, { message: 'Please upload at least one image.' }),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type PersonalInfoNoImages = Omit<PersonalInfo, 'images'>;

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
