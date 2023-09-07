import { Router } from 'express';
import { verifyAccessTokenMiddleware } from '../../middleware/verifyAccessToken';
import { getSession } from '../../utils/session';
import { getLikesTeaser } from '../../controllers/likes';

const likesRouter = Router();
likesRouter.use(verifyAccessTokenMiddleware);

// This should return the number of users that like the user. Premium users can see the list of users that like them.
likesRouter.route('/teaser').get(async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    return res.status(401).send('Unauthorized');
  }
  const result = await getLikesTeaser(session.id);
  if (result.status === 'error') {
    return res.status(500).send('Internal Server Error');
  }
  const { likes, latestLike } = result.data;
  return res.status(200).json({ likes, latestLike });
});

export { likesRouter };
