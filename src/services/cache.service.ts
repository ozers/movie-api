import { getCache, setCache, deleteCache } from '../utils/redis.client';

/**
 * Prefix ile tam cache anahtarı oluşturur
 */
const getCacheKey = (prefix: string, key: string): string => {
  return `${prefix}:${key}`;
};

/**
 * Cache servis factory - belirli bir resource için cache yardımcıları oluşturur
 * @param prefix Cache anahtarı öneki (ör: "movie", "director")
 * @param defaultTtl Varsayılan TTL (saniye)
 */
export const createCacheService = (prefix: string, defaultTtl = 3600) => {
  /*Cache'den veri oku*/
  const get = async <T>(key: string): Promise<T | null> => {
    const cacheKey = getCacheKey(prefix, key);
    const data = await getCache(cacheKey);
    
    if (!data) {
      return null;
    }
    
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Cache parse error: ${cacheKey}`, error);
      return null;
    }
  };

  /**
   * Veriyi cache'e yazar
   */
  const set = async <T>(key: string, data: T, ttl?: number): Promise<void> => {
    const cacheKey = getCacheKey(prefix, key);
    await setCache(cacheKey, JSON.stringify(data), ttl || defaultTtl);
  };

  /*Cache'den veri sil*/
  const del = async (key: string): Promise<void> => {
    const cacheKey = getCacheKey(prefix, key);
    await deleteCache(cacheKey);
  };

  /*Fonksiyon sonucunu cache'le*/
  const wrap = async <T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> => {
    const cached = await get<T>(key);
    
    if (cached !== null) {
      return cached;
    }
    
    const result = await fn();
    
    await set(key, result, ttl);
    
    return result;
  };

  return {
    get,
    set,
    delete: del,
    wrap
  };
}; 