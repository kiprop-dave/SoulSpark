import { Router } from 'express';
import { verifyAccessTokenMiddleware } from '../../middleware/verifyAccessToken';
import { getSession } from '../../utils/session';
import { getFreeLikes, getLikesTeaser, getPremiumLikes } from '../../controllers/likes';

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

likesRouter.route('/premium').get(async (req, res) => {
  try {
    const session = await getSession(req);
    if (!session) {
      return res.status(401).send('Unauthorized');
    }
    if (session.accountType !== 'Premium') {
      return res.status(403).send('Forbidden');
    }
    const result = await getPremiumLikes(session.id);
    if (result.status === 'error') {
      return res.status(500).send('Internal Server Error');
    }
    return res.status(200).json(result.data);
  } catch (err) {
    console.error(err, 'error in /likes/premium');
    return res.status(500).send('Internal Server Error');
  }
});

likesRouter.route('/free').get(async (req, res) => {
  try {
    const session = await getSession(req);
    if (!session) {
      return res.status(401).send('Unauthorized');
    }
    const n = req.query.n;
    if (!n || typeof n !== 'string') return res.status(400).send('Bad Request');

    const result = await getFreeLikes(session.id, Number(n));
    if (result.status === 'error') {
      return res.status(500).send('Internal Server Error');
    }
    return res.status(200).json(result.data);
  } catch (err) {
    console.error(err, 'error in /likes/free');
    return res.status(500).send('Internal Server Error');
  }
});

export { likesRouter };
