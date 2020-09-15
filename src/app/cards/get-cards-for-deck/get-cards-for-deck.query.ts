import { Query } from '@app/processing/query';

interface Payload {
  deckId: string;
  userId: string;
}

export const GET_CARDS_FOR_DECK_QUERY = 'cards/get-cards-for-deck';

export class GetCardsForDeckQuery extends Query<Payload> {
  constructor(payload: Payload) {
    super(GET_CARDS_FOR_DECK_QUERY, payload);
  }
}
