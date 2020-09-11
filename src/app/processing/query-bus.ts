import { NotFoundError } from '@errors/not-found.error';
import { QueryHandler } from './query-handler';
import { Query } from './query';

interface Dependencies {
  queryHandlers: QueryHandler<any, any>[];
}

export class QueryBus {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(query: Query<any>) {
    const { queryHandlers } = this.dependencies;

    const queryHandler = queryHandlers.find(
      (existingQueryHandler) => existingQueryHandler.type === query.type,
    );

    if (!queryHandler) {
      throw new NotFoundError(`Query handler for query of type: "${query.type}" does not exist.`);
    }

    return queryHandler.handle(query);
  }
}
