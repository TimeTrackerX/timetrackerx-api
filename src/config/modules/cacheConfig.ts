import Env from '@app/utils/Env';
import { Config, MemoryConfig } from 'cache-manager';
import { RedisClientOptions } from 'redis';

const memoryParams = new URLSearchParams(Env.asString('MEMORY_CACHE'));
const memoryConfig: MemoryConfig = {
    ttl: Number(memoryParams.get('ttl') || 2000),
    max: Number(memoryParams.get('max') || 20),
};

const redisConfig: RedisClientOptions & Config = {
    url: Env.asString('REDIS_CACHE', undefined),
};

export const cacheConfig = {
    memory: memoryConfig,
    redis: redisConfig,
};
