import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import prisma from '../lib/prisma';
import {
  UserProfile,
  personalInfoSchema,
  basicInfoSchema,
  otherInfoSchema,
  preferencesSchema,
} from '../types';

// This checks if a user has completed the compulsory profile fields
export async function checkUserProfile(userId: string): Promise<boolean> {
  try {
    const hasProfile = await prisma.profile.findUnique({
      select: {
        first_name: true,
        last_name: true,
        dateOfBirth: true,
        gender: true,
        images: true,
        lookingFor: true,
        attraction: true,
        minimumAge: true,
        maximumAge: true,
      },
      where: {
        userId: userId,
      },
    });

    if (hasProfile === null) {
      return false;
    }

    const keys = Object.keys(hasProfile) as Array<keyof typeof hasProfile>;
    const hasAllKeys = keys.every((key) => hasProfile[key] !== null);
    return hasAllKeys;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
      include: {
        images: true,
      },
    });
    if (profile === null) {
      return null;
    }

    const personalInfo = await personalInfoSchema.parseAsync(profile);
    const basicInfo = await basicInfoSchema.parseAsync(profile);
    const otherInfo = await otherInfoSchema.parseAsync(profile);
    const preferences = await preferencesSchema.parseAsync({
      lookingFor: profile.lookingFor,
      attraction: profile.attraction,
      ageRange: {
        min: profile.minimumAge,
        max: profile.maximumAge,
      },
    });

    return {
      personalInfo,
      basicInfo,
      otherInfo,
      preferences,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      console.log(err.issues);
    }
    throw new Error('Error fetching user profile');
  }
}

// id                  String         @id @default(uuid())
// first_name          String         @db.VarChar(50)
// last_name           String         @db.VarChar(50)
// dateOfBirth         DateTime
// gender              Gender
// images              DigitalAsset[]
// bio                 String?
// languages           String[]
// zodiac              String?        @db.VarChar(50)
// education           String?        @db.VarChar(50)
// occupation          String?        @db.VarChar(50)
// interests           String[]
// diet                String?        @db.VarChar(50)
// drinking            String?        @db.VarChar(50)
// smoking             String?        @db.VarChar(50)
// pets                String?        @db.VarChar(50)
// socialMediaActivity String?        @db.VarChar(50)
// socials             String[]
// lookingFor          String         @db.VarChar(150)
// attraction          String         @db.VarChar(50)
// minimumAge          Int
// maximumAge          Int
//
export async function createProfile(userId: string, data: UserProfile): Promise<UserProfile> {
  try {
    const createdProfile = await prisma.profile.create({
      data: {
        first_name: data.personalInfo.first_name,
        last_name: data.personalInfo.last_name,
        dateOfBirth: data.personalInfo.dateOfBirth,
        gender: data.personalInfo.gender,
        images: {
          create: data.personalInfo.images,
        },
        bio: data?.basicInfo?.bio,
        languages: data?.basicInfo?.languages!,
        zodiac: data?.basicInfo?.zodiac,
        education: data?.basicInfo?.education,
        occupation: data?.basicInfo?.occupation,
        interests: data?.otherInfo?.interests!,
        diet: data?.otherInfo?.diet,
        drinking: data?.otherInfo?.drinking,
        smoking: data?.otherInfo?.smoking,
        pets: data?.otherInfo?.pets,
        socialMediaActivity: data?.otherInfo?.socialMediaActivity,
        lookingFor: data.preferences.lookingFor,
        attraction: data.preferences.attraction,
        minimumAge: data.preferences.ageRange.min,
        maximumAge: data.preferences.ageRange.max,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        images: true,
      },
    });

    const personalInfo = await personalInfoSchema.parseAsync(createdProfile);
    const basicInfo = await basicInfoSchema.parseAsync(createdProfile);
    const otherInfo = await otherInfoSchema.parseAsync(createdProfile);
    const preferences = await preferencesSchema.parseAsync({
      lookingFor: createdProfile.lookingFor,
      attraction: createdProfile.attraction,
      ageRange: {
        min: createdProfile.minimumAge,
        max: createdProfile.maximumAge,
      },
    });

    return {
      personalInfo,
      basicInfo,
      otherInfo,
      preferences,
    };
  } catch (err) {
    console.log(err);
    throw new Error('Error updating user info');
  }
}
