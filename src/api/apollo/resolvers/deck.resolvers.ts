import { QueryResolvers } from './resolver.types';
import { ApolloContext } from '../apollo.server';
import { GetDeckByIdQuery } from '@app/decks/get-deck-by-id/get-deck-by-id.query';
import { GetAllDecksQuery } from '@app/decks/get-all-decks/get-all-decks.query';

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

const getAllDecks: QueryResolvers['getAllDecks'] = async (
  _,
  { page, limit },
  { queryBus, userId }: ApolloContext,
) =>
  queryBus.handle(
    new GetAllDecksQuery({
      userId,
      page,
      limit,
    }),
  );

export const resolvers = {
  Query: {
    getDeck,
    getAllDecks,
  },
};
