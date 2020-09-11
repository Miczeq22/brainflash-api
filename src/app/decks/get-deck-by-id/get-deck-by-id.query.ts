import { Query } from '@app/processing/query';

interface Payload {
  deckId: string;
  userId: string;
}

export const GET_DECK_BY_ID_QUERY = 'decks/get-deck-by-id';

export class GetDeckByIdQuery extends Query<Payload> {
  constructor(payload: Payload) {
    super(GET_DECK_BY_ID_QUERY, payload);
  }
}
