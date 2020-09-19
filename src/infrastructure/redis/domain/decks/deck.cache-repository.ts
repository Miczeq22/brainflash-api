import { DeckReadModel } from '@infrastructure/mongo/domain/decks/deck.read-model';
import { BaseRedisRepository } from '@infrastructure/redis/base-redis-repository';
import { RedisClient } from 'redis';

interface Dependencies {
  redisClient: RedisClient;
}

export class DeckCacheRepository extends BaseRedisRepository<DeckReadModel[]> {
  constructor(dependencies: Dependencies) {
    super({
      redisClient: dependencies.redisClient,
      persistedKeyPrefix: 'DECKS_',
    });
  }
}
