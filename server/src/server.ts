import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import oauthCallbackRouter from './routes/oauthCallback';
import { env } from './lib/env';
import { appConstants } from './utils/constants';

const app = express();

const allowedOrigins = [appConstants.CLIENT_URL];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return cb(new Error(msg), false);
    }
    return cb(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/oauth/callback', oauthCallbackRouter);

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));
