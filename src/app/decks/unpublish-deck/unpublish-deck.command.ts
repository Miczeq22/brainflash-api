import { Command } from '@app/processing/command';

interface Payload {
  userId: string;
  deckId: string;
}

export const UNPUBLISH_DECK_COMMAND = 'decks/unpublish-deck';

export class UnpublishDeckCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(UNPUBLISH_DECK_COMMAND, payload);
  }
}
