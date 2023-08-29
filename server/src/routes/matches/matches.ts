import { Router } from 'express';
import { getSession } from '../../utils/session';
import { verifyAccessTokenMiddleware } from '../../middleware/verifyAccessToken';
import { getPossibleMatches, likeUser, dislikeUser, getMatches } from '../../controllers/matches';

const matchesRouter = Router();

matchesRouter.use(verifyAccessTokenMiddleware);

// This route should return a list of users that the user has matched with
matchesRouter.route('/').get(async (req, res) => {
  const session = await getSession(req);
  if (!session) return res.status(401).send('Unauthorized');
  const result = await getMatches(session.id);
  if (result.status === 'success') {
    return res.status(200).json(result.data);
  }
  return res.status(500).send('Internal server error');
});

// This route should return a list of possible matches for a user
matchesRouter.route('/possible').get(async (req, res) => {
  const session = await getSession(req);
  if (!session) return res.status(401).send('Unauthorized');
  const result = await getPossibleMatches(session.id);
  if (result.status === 'success') {
    return res.status(200).json(result.data);
  } else {
    return res.status(500).send('Internal server error');
  }
});

matchesRouter.route('/like/:id').get(async (req, res) => {
  const session = await getSession(req);
  if (!session) return res.status(401).send('Unauthorized');
  const matchId = req.params.id;
  if (!matchId || matchId.length < 1) return res.status(400).send('Bad request');
  const result = await likeUser(session.id, matchId);
  if (result.status === 'success') {
    const { isMatch, conversationId, matchedAt } = result;
    return res.status(200).json({ isMatch, conversationId, matchedAt });
  } else {
    return res.status(500).send('Internal server error');
  }
});

matchesRouter.route('/dislike/:id').get(async (req, res) => {
  const session = await getSession(req);
  if (!session) return res.status(401).send('Unauthorized');
  const matchId = req.params.id;
  if (!matchId || matchId.length < 1) return res.status(400).send('Bad request');
  const result = await dislikeUser(session.id, matchId);
  if (result.status === 'success') {
    return res.status(200).send('OK');
  } else {
    return res.status(500).send('Internal server error');
  }
});

export { matchesRouter };
