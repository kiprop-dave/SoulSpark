// This file contains all functions for managing user sessions

import { redis } from "../lib/redis";
import { User } from "@prisma/client";
import { env } from "../lib/env";
import { sign } from "jsonwebtoken";
import { verifyRefreshToken } from "./webToken";
import { sessionDataSchema, SessionData } from "../types";
import { Request, Response } from "express";

// this function will create a session for a user by storing their session data in redis
// and setting a refresh token cookie on the client and saves a copy of the refresh token in redis. This 
// is done when the user first logs in.
type UserSessionData = Pick<User, "id" | "email">;

export async function createSession(res: Response, user: UserSessionData) {
  try {
    const refreshToken = sign({ userId: user.id }, env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    const sessionData: SessionData = {
      id: user.id,
      email: user.email,
      refreshToken,
    };
    await redis.set(`session:${user.id}`, JSON.stringify(sessionData), { EX: 60 * 60 * 24 * 7 });
    res.cookie("refreshToken", refreshToken, { sameSite: "strict", maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true });
    console.log("Session created");
  } catch (err) {
    console.log(err);
    throw new Error("Error creating session");
  }
};

// This function will retrieve the session data for a user from redis. This is done in a middleware function
// whenever a user attempts to access a protected route. If the session data is not found, the user is not logged in
// and the request is rejected.
export async function getSession(req: Request): Promise<SessionData | null> {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return null;
  const tokenPayload = verifyRefreshToken<{ userId: string }>(refreshToken);
  if (!tokenPayload) return null;
  const sessionData = await redis.get(`session:${tokenPayload.userId}`);
  if (!sessionData) return null;
  return sessionDataSchema.parse(JSON.parse(sessionData));
};

// This function will delete a user's session from redis. This is done when a user logs out.
// It will also clear the refresh token cookie from the client.
export async function deleteSession(res: Response, userId: string) {
  await redis.del(`session:${userId}`);
  res.clearCookie("refreshToken");
}

