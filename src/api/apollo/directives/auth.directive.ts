/* eslint-disable no-param-reassign */
import { SchemaDirectiveVisitor, VisitableSchemaType } from 'graphql-tools';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@errors/unauthorized.error';
import { ApolloContext } from '../apollo.server';

export class AuthDirective extends SchemaDirectiveVisitor {
  constructor(config: {
    name: string;
    visitedType: VisitableSchemaType;
    schema: GraphQLSchema;
    context: { [key: string]: any };
  }) {
    super(config as any);
  }

  public visitFieldDefinition(field: any) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = this.auth(resolve);
  }

  private auth = (next: Function) => (root: any, args: any, context: ApolloContext, info: any) => {
    const { jwt: token } = context;

    if (!token) {
      throw new UnauthorizedError();
    }

    try {
      const { userId }: any = jwt.verify(token, process.env.JWT_TOKEN);

      return next(root, args, { ...context, userId }, info);
    } catch {
      throw new UnauthorizedError();
    }
  };
}
