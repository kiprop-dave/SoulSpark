import { Router } from 'express';
import { z } from 'zod';
import { verifyAccessTokenMiddleware } from '../../middleware/verifyAccessToken';
import { getSession } from '../../utils/session';
import {
  getConversations,
  postMessage,
  postMessageInput,
  markMessagesSeen,
} from '../../controllers/conversation';

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

// Return a single conversation
conversationRouter
  .route('/:conversationId')
  .get(async (req, res) => {})
  .post(async (req, res) => {
    const session = await getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const body = postMessageInput.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const result = await postMessage(session.id, req.params.conversationId, body.data);
    if (result.status === 'error') {
      return res.status(500).send('Internal Server Error');
    }
    return res.status(200).json(result.data);
  });

const markMessagesSeenBody = z.object({
  messageIds: z.array(z.string()),
});
conversationRouter.route('/seen').patch(async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = markMessagesSeenBody.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: 'Bad Request' });
  }
  const result = await markMessagesSeen(session.id, body.data.messageIds);
  if (result.status === 'error') {
    return res.status(500).send('Internal Server Error');
  }
  return res.status(200).json({ status: 'success' });
});

export { conversationRouter };
