import { RedisClient } from 'redis';
import { promisify } from 'util';

export interface BaseRedisRepositoryDependencies {
  redisClient: RedisClient;
  persistedKeyPrefix: string;
}

export abstract class BaseRedisRepository<T> {
  private readonly redisSet: (
    key: string,
    value: string,
    ex?: string,
    seconds?: number,
  ) => Promise<any>;

  private readonly redisGet: (key: string) => Promise<string>;

  private readonly redisDel: (key: string) => Promise<number>;

  private readonly redisTtl: (key: string) => Promise<number>;

  private readonly keys: (pattern: string) => Promise<string[]>;

  protected readonly persistedKeyPrefix: string;

  protected constructor({ redisClient, persistedKeyPrefix }: BaseRedisRepositoryDependencies) {
    this.redisSet = promisify(redisClient.set.bind(redisClient));
    this.redisGet = promisify(redisClient.get.bind(redisClient));
    this.redisDel = promisify(redisClient.del.bind(redisClient));
    this.redisTtl = promisify(redisClient.ttl.bind(redisClient));
    this.keys = promisify(redisClient.keys.bind(redisClient));
    this.persistedKeyPrefix = persistedKeyPrefix;
  }

  private parseKey(key: string) {
    return `${this.persistedKeyPrefix}${key}`;
  }

  public async persistData(key: string, data: T, expirationTime: number) {
    if (expirationTime > 0) {
      return this.redisSet(this.parseKey(key), JSON.stringify(data), 'EX', expirationTime);
    }
    return this.redisSet(this.parseKey(key), JSON.stringify(data));
  }

  public async getData(key: string): Promise<T | undefined> {
    const groupString = await this.redisGet(this.parseKey(key));
    if (groupString) {
      return JSON.parse(groupString);
    }
    return undefined;
  }

  public async getNumberOfKeys() {
    const keys = await this.keys(`${this.persistedKeyPrefix}*`);
    return keys.length;
  }

  public async getTtl(key: string): Promise<number> {
    return this.redisTtl(this.parseKey(key));
  }

  public async deleteKey(key: string): Promise<number> {
    return this.redisDel(this.parseKey(key));
  }
}
