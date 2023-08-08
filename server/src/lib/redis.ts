import { createClient } from 'redis';
import { env } from './env';

export const redis = createClient({
  url: env.REDIS_URL,
});

const connectRedis = async () => {
  try {
    await redis.connect();
    console.log('Redis connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectRedis();

redis.on('error', () => {
  console.error('Redis error');
});
