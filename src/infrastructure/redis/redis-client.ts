import { createClient } from 'redis';

require('dotenv').config();

export const createRedisClient = () =>
  createClient({
    port: Number(process.env.REDIS_PORT),
  });
