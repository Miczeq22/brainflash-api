import { QueryResolvers } from './resolver.types';
import { ApolloContext } from '../apollo.server';
import { GetDeckByIdQuery } from '@app/decks/get-deck-by-id/get-deck-by-id.query';

const getDeck: QueryResolvers['getDeck'] = async (
  _,
  { deckID },
  { queryBus, userId }: ApolloContext,
) =>
  queryBus.handle(
    new GetDeckByIdQuery({
      userId,
      deckId: deckID,
    }),
  );

export const resolvers = {
  Query: {
    getDeck,
  },
};
