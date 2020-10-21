import { BaseRedisRepository } from '@infrastructure/redis/base-redis-repository';
import { RedisClient } from 'redis';

interface Dependencies {
  redisClient: RedisClient;
}

export class TagsCacheRepository extends BaseRedisRepository<string[]> {
  constructor(dependencies: Dependencies) {
    super({
      redisClient: dependencies.redisClient,
      persistedKeyPrefix: 'TAGS_',
    });
  }
}
