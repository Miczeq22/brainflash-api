import { resolvers } from './schema';
import { schemas } from './typedefs';
import { ApolloServer } from 'apollo-server-express';
import { QueryBus } from '@app/processing/query-bus';
import { AuthDirective } from './directives/auth.directive';

export interface ApolloContext {
  userId?: string;
  jwt?: string;
  queryBus: QueryBus;
}

interface Dependencies {
  queryBus: QueryBus;
}

export class Server {
  private apolloInstance: ApolloServer;

  constructor(private readonly dependencies: Dependencies) {
    this.init();
  }

  private init() {
    this.apolloInstance = new ApolloServer({
      resolvers,
      typeDefs: Object.values(schemas),
      introspection: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV === 'development',
      schemaDirectives: {
        // @ts-ignore
        auth: AuthDirective,
      },
      context: ({ res, req: { headers } }): ApolloContext => ({
        userId: res.locals.userId ?? null,
        queryBus: this.dependencies.queryBus,
        jwt: headers.authorization && headers.authorization.slice(7),
      }),
      formatError: (error) => ({
        message: error.originalError.message,
      }),
    });
  }

  public getApolloInstance() {
    return this.apolloInstance;
  }
}
