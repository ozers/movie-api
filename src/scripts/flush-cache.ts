import { connectRedis, disconnectRedis, flushCache } from '../utils/redis.client';

/**
 * Script to flush all Redis cache data
 * 
 * Usage: 
 * - Local: npx ts-node src/scripts/flush-cache.ts
 * - Docker: docker-compose exec app npx ts-node src/scripts/flush-cache.ts
 */
async function main() {
  try {
    console.log('Connecting to Redis...');
    await connectRedis();
    
    console.log('Flushing Redis cache...');
    await flushCache();
    console.log('Cache flushed successfully!');
    
    console.log('Disconnecting from Redis...');
    await disconnectRedis();
    
    process.exit(0);
  } catch (error) {
    console.error('Error flushing cache:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 