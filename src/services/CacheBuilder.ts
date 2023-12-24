import appConfig from '@app/config';
import { CacheLogger } from '@app/utils/loggers';
import { caching, MultiCache, multiCaching } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import crypto from 'crypto';

export class CacheBuilder {
    static cache: MultiCache | null = null;

    static async remember<T>(
        type: string,
        args: Record<string, string | number | boolean | Date>,
        dataBuilder: () => T | Promise<T>,
        ttl?: number,
    ) {
        const CacheEngine = await CacheBuilder.getCacheEngine();

        const cacheKey = CacheBuilder.buildCacheKey(type, args);
        let value = await CacheEngine.get<T>(cacheKey);
        if (value === undefined) {
            try {
                value = await dataBuilder();
            } catch (e) {
                throw e;
            }
            await CacheEngine.set(cacheKey, value, ttl);
        }

        return value;
    }
    static buildCacheKey(type: string, args: Record<string, string | number | boolean | Date>): string {
        const argsStr = Object.entries(args)
            .map(([k, v]) => `${k}:${String(v)}`)
            .join('-');
        const hash = crypto.createHash('md5').update(argsStr).digest('hex');

        return `${type}:${hash}`;
    }
    static getCacheEngine = async (): Promise<MultiCache> => {
        if (this.cache === null) {
            const cache = await CacheBuilder.buildMultiCache();
            if (cache) {
                this.cache = cache;
            }
        }
        return this.cache!;
    };

    private static async buildMultiCache() {
        try {
            const memoryCache = await this.buildMemoryCache();
            const redisCache = await this.buildRedisCache();
            return multiCaching([memoryCache, redisCache]);
        } catch (e) {
            CacheLogger.error(`Error building cache engine: ${(e as Error).message}`);
            return null;
        }
    }

    private static buildMemoryCache() {
        return caching('memory', appConfig.cache.memory);
    }

    private static async buildRedisCache() {
        return caching(redisStore, appConfig.cache.redis);
    }
}
