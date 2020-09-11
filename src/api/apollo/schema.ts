import merge from 'lodash.merge';
import { makeExecutableSchema } from 'apollo-server-express';
import { schemas } from './typedefs';
import { resolvers as deckResolvers } from './resolvers/deck.resolvers';

export const resolvers = merge({}, deckResolvers);

export default makeExecutableSchema({
  resolvers,
  typeDefs: Object.values(schemas),
});
