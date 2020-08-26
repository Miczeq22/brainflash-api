import { Query } from './query';

export abstract class QueryHandler<Q extends Query<any>> {
  constructor(public readonly type: string) {}

  public abstract handle(query: Q): Promise<any>;
}
