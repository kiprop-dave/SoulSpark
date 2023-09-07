import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import oauthCallbackRouter from './routes/oauthCallback';
import usersRouter from './routes/users/users';
import { matchesRouter } from './routes/matches/matches';
import { likesRouter } from './routes/likes/route';
import { conversationRouter } from './routes/conversations/route';
import tenorRouter from './routes/tenor';
import { env } from './lib/env';
import { appConstants } from './utils/constants';

const app = express();

const allowedOrigins = [appConstants.CLIENT_URL];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return cb(new Error(msg), false);
      }
      return cb(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/oauth/callback', oauthCallbackRouter);
app.use('/users', usersRouter);
app.use('/matches', matchesRouter);
app.use('/likes', likesRouter);
app.use('/conversations', conversationRouter);
app.use('/tenor', tenorRouter);

app.use('*', (_, res) => {
  return res.status(404).send('Not found');
});

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));
