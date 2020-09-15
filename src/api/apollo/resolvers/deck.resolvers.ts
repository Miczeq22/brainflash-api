import { QueryResolvers } from './resolver.types';
import { ApolloContext } from '../apollo.server';
import { GetDeckByIdQuery } from '@app/decks/get-deck-by-id/get-deck-by-id.query';
import { GetAllDecksQuery } from '@app/decks/get-all-decks/get-all-decks.query';
import { DeckReadModel } from '@infrastructure/mongo/domain/decks/deck.read-model';
import { GetCardsForDeckQuery } from '@app/cards/get-cards-for-deck/get-cards-for-deck.query';
import jwt from 'jsonwebtoken';

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

const cards = async (parent: DeckReadModel, _, { queryBus, jwt: token }: ApolloContext) => {
  const { userId } = jwt.decode(token) as { userId: string };

  return queryBus.handle(
    new GetCardsForDeckQuery({
      userId,
      deckId: parent.id,
    }),
  );
};

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
  Deck: {
    cards,
  },
};
