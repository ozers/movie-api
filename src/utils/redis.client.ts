import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
  socket: {
    reconnectStrategy: (retries) => {
      const delay = Math.min(retries * 500, 10000);
      return delay;
    }
  }
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis connection established');
});

redisClient.on('ready', () => {
  console.log('Redis ready for use');
});

let connectionPromise: Promise<void> | null = null;

const connectRedis = async (): Promise<void> => {
  if (!redisClient.isOpen) {
    if (!connectionPromise) {
      connectionPromise = redisClient.connect().then(() => {
        connectionPromise = null;
      }).catch(err => {
        connectionPromise = null;
        console.error('Redis connection error:', err);
        throw err;
      });
    }
    await connectionPromise;
  }
};

const disconnectRedis = async (): Promise<void> => {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
  }
};

const getCache = async (key: string): Promise<string | null> => {
  try {
    await connectRedis();
    return await redisClient.get(key);
  } catch (error) {
    console.error(`Cache read error (${key}):`, error);
    return null;
  }
};

const setCache = async (key: string, value: string, ttl = 3600): Promise<void> => {
  try {
    await connectRedis();
    await redisClient.set(key, value, { EX: ttl });
  } catch (error) {
    console.error(`Cache write error (${key}):`, error);
  }
};

const deleteCache = async (key: string): Promise<void> => {
  try {
    await connectRedis();
    await redisClient.del(key);
  } catch (error) {
    console.error(`Cache delete error (${key}):`, error);
  }
};

const flushCache = async (): Promise<void> => {
  try {
    await connectRedis();
    await redisClient.flushAll();
  } catch (error) {
    console.error('Cache flush error:', error);
  }
};

export {
  redisClient,
  connectRedis,
  disconnectRedis,
  getCache,
  setCache,
  deleteCache,
  flushCache
}; 