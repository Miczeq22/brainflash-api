import { Command } from '@app/processing/command';

interface Payload {
  userId: string;
  deckId: string;
}

export const REMOVE_RATING_COMMAND = 'decks/remove-rating';

export class RemoveRatingCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(REMOVE_RATING_COMMAND, payload);
  }
}
