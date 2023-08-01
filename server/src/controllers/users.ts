import prisma from "../lib/prisma";
import { GoogleUserInfo } from "../types";

type UserInfo = GoogleUserInfo

export async function createAcccount(userInfo: UserInfo, provider: "Google" | "Facebook") {
  try {
    const exists = await prisma.account.findUnique({
      where: {
        provider_providerId: {
          providerId: userInfo.id,
          provider: provider
        }
      },
      include: {
        user: true
      }
    });
    if (exists) {
      return { id: exists.user.id, email: exists.user.email };
    };
    const newUser = await prisma.user.create({
      data: {
        email: userInfo.email,
        emailVerified: userInfo.verified_email,
        Account: {
          create: {
            provider: provider,
            providerId: userInfo.id
          }
        }
      }
    });
    return { id: newUser.id, email: newUser.email };
  } catch (err) {
    console.log(err);
    throw new Error("Error creating user");
  }
};


export async function checkUserProfile(userId: string): Promise<boolean> {
  try {
    const hasProfile = await prisma.profile.findUnique({
      where: {
        userId: userId
      },
    });
    if (hasProfile === null) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
