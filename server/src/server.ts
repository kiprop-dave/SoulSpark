import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import { env } from './lib/env';

const app = express();

app.use(cors());
app.use(cookieParser());

app.use('/auth', authRouter);

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));
