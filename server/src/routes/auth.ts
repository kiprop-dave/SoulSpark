import { Router } from 'express';
import { createUser, getUserByEmail } from '../controllers/users';
import { userCredentialsSchema } from '../types';
import { getSession, createSession } from '../utils/session';
import { pusherServer } from '../lib/pusher';
import { comparePassword, hashPassword } from '../utils/password';
import { generateAccessToken } from '../utils/webToken';
import { checkUserProfile } from '../controllers/profile';
import { ZodError, z } from 'zod';
const authRouter = Router();

// this is the route that the client will use to obtain a user session if it exists and then
// give the user a token to use for future requests
authRouter.route('/me').get(async (req, res) => {
  const session = await getSession(req);
  if (!session) return res.status(401).send({ message: 'You are not logged in.' });

  const accessToken = generateAccessToken(session.id, '15m');
  const filledProfile = await checkUserProfile(session.id);

  return res.status(200).json({
    id: session.id,
    email: session.email,
    filledProfile: filledProfile,
    accessToken,
  });
});

// This route is used to register a new user
authRouter.route('/register').post(async (req, res) => {
  try {
    const validatedUser = userCredentialsSchema.parse(req.body);

    const hashedPassword = await hashPassword(validatedUser.password);
    validatedUser.password = hashedPassword;

    const result = await createUser(validatedUser);

    if (result.status === 'success') {
      return res.sendStatus(200);
    }

    if (result.status === 'failed' && result.message === 'Conflict') {
      return res.status(409).send({ message: 'User already exists.' });
    }

    return res.sendStatus(500);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.sendStatus(400);
    }
    console.error(err);
    return res.sendStatus(500);
  }
});

// This route is used to login a user
authRouter.route('/login').post(async (req, res) => {
  try {
    const validatedUser = userCredentialsSchema.parse(req.body);

    const user = await getUserByEmail(validatedUser.email);

    if (user.status === 'failed') {
      if (user.message === 'Not found') {
        return res.status(401).send({ message: 'Incorrect email or password.' });
      }
      return res.sendStatus(500);
    }

    const passwordMatch = await comparePassword(validatedUser.password, user.user.password!);

    if (!passwordMatch) {
      return res.status(401).send({ message: 'Incorrect email or password.' });
    }

    const session = await createSession(res, { id: user.user.id, email: user.user.email });

    const accessToken = generateAccessToken(session.id, '15m');
    const filledProfile = await checkUserProfile(session.id);

    return res.status(200).json({
      id: session.id,
      email: session.email,
      filledProfile: filledProfile,
      accessToken,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.sendStatus(400);
    }
    console.error(err);
    return res.sendStatus(500);
  }
});

authRouter.route('/pusher').post(async (req, res) => {
  // const session = await getSession(req);
  // if (!session) {
  //   return res.status(401).send({ message: 'You are not logged in.' });
  // }
  const body = z
    .object({
      socket_id: z.string(),
      channel_name: z.string(),
    })
    .safeParse(req.body);
  if (!body.success) {
    return res.status(400).send({ message: 'Invalid request.' });
  }
  const auth = pusherServer.authorizeChannel(body.data.socket_id, body.data.channel_name);
  return res.send(auth);
});

export default authRouter;
