export const apiBaseUrl = 'http://localhost:3000';
const googleClientId = '1097348491467-bh3596v79r660l034jnlj7b2nqed6vcs.apps.googleusercontent.com';

export const appConstants = {
  googleOauthUrl: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${apiBaseUrl}/oauth/callback/google&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`,
};
