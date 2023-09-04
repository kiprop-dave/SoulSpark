import { env } from './env';
import PusherServer from 'pusher';

export const pusherServer = new PusherServer({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: 'ap2',
  useTLS: true,
});
