import { CardReadModel } from '@infrastructure/mongo/domain/cards/card.read-model';
import { BaseRedisRepository } from '@infrastructure/redis/base-redis-repository';
import { RedisClient } from 'redis';

interface Dependencies {
  redisClient: RedisClient;
}

export class CardCacheRepository extends BaseRedisRepository<CardReadModel[]> {
  constructor(dependencies: Dependencies) {
    super({
      redisClient: dependencies.redisClient,
      persistedKeyPrefix: 'CARDS_',
    });
  }
}
