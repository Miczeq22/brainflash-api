import { Command } from '@app/processing/command';

interface Payload {
  deckId: string;
  userId: string;
}

export const DELETE_DECK_COMMAND = 'decks/delete-deck';

export class DeleteDeckCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(DELETE_DECK_COMMAND, payload);
  }
}
