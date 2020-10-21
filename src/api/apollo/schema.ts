import merge from 'lodash.merge';
import { makeExecutableSchema } from 'apollo-server-express';
import { schemas } from './typedefs';
import { resolvers as deckResolvers } from './resolvers/deck.resolvers';
import { resolvers as tagsResolvers } from './resolvers/tags.resolvers';

export const resolvers = merge({}, deckResolvers, tagsResolvers);

export default makeExecutableSchema({
  resolvers,
  typeDefs: Object.values(schemas),
});
