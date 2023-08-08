// This file contains functions for fetching user data from providers.
import { accessTokenSchema, AccessToken, googleUserInfoSchema, GoogleUserInfo } from '../types';
import { env } from '../lib/env';

//TODO:Handle errors in this functions

export async function getGoogleAccessToken(code: string): Promise<AccessToken> {
  //TODO:Remove hard-coded redirect uri
  const url = `https://oauth2.googleapis.com/token?code=${code}&client_id=${env.GOOGLE_CLIENT_ID}&client_secret=${env.GOOGLE_CLIENT_SECRET}&redirect_uri=http://localhost:3000/oauth/callback/google&grant_type=authorization_code`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
  });
  const data = await res.json();
  return accessTokenSchema.parse(data);
}

export async function getGoogleUserInfo(tokenInfo: AccessToken): Promise<GoogleUserInfo> {
  const url = `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${tokenInfo.access_token}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenInfo.id_token}`,
    },
  });
  const data = await res.json();
  return googleUserInfoSchema.parse(data);
}
