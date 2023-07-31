// This file contains functions to generate and verify web tokens.

import { sign, verify } from "jsonwebtoken";
import { env } from "../lib/env";

// This function will generate a web token for a user.
export function generateAccessToken(userId: string, expiresIn: string) {
  return sign({ userId }, env.ACCESS_TOKEN_SECRET, { expiresIn });
};

// This function will verify a web token for a user.
export function verifyAccessToken(token: string): boolean {
  try {
    verify(token, env.ACCESS_TOKEN_SECRET);
    return true;
  } catch {
    return false;
  }
};

// This function will verify a refresh token for a user.
export function verifyRefreshToken<T>(token: string): T | null {
  try {
    const data = verify(token, env.REFRESH_TOKEN_SECRET);
    return data as T;
  } catch {
    return null;
  }
};
