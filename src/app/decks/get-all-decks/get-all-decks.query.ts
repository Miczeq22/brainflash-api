import { Query } from '@app/processing/query';

interface Payload {
  userId: string;
  page?: number;
  limit?: number;
}

export const GET_ALL_DECKS_QUERY = 'decks/get-all-decks';

export class GetAllDecksQuery extends Query<Payload> {
  constructor(payload: Payload) {
    super(GET_ALL_DECKS_QUERY, payload);
  }
}
