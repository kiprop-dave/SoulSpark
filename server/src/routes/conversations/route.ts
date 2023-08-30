import { Router } from 'express';
import { verifyAccessTokenMiddleware } from '../../middleware/verifyAccessToken';
import { getSession } from '../../utils/session';
import { getConversations } from '../../controllers/conversation';

const conversationRouter = Router();

conversationRouter.use(verifyAccessTokenMiddleware);

conversationRouter.route('/').get(async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const result = await getConversations(session.id);
  if (result.status === 'error') {
    return res.status(500).send('Internal Server Error');
  }
  return res.status(200).json(result.data);
});

export { conversationRouter };
