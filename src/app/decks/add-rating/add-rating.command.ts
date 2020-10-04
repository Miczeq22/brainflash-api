import { Command } from '@app/processing/command';

interface Payload {
  userId: string;
  deckId: string;
  rating: number;
}

export const ADD_RATING_COMMAND = 'decks/add-rating';

export class AddRatingCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(ADD_RATING_COMMAND, payload);
  }
}
