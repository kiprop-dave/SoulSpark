import { z } from 'zod';
import { Router } from 'express';
import { getGoogleAccessToken, getGoogleUserInfo } from '../utils/oauth';
import { appConstants } from '../utils/constants';
import { createAcccount } from '../controllers/users';
import { createSession } from '../utils/session';

const oauthCallbackRouter = Router();

oauthCallbackRouter.route('/google').get(async (req, res) => {
  try {
    const code = z.string().parse(req.query.code);
    const tokenInfo = await getGoogleAccessToken(code);
    const userInfo = await getGoogleUserInfo(tokenInfo);
    const userSessionData = await createAcccount(userInfo, 'Google');
    await createSession(res, userSessionData);
    return res.redirect(appConstants.CLIENT_URL);
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error(err);
      return res.sendStatus(400);
    }
    console.error(err);
    return res.sendStatus(500);
  }
});

export default oauthCallbackRouter;
