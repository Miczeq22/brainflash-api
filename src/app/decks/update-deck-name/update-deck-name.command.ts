import { Command } from '@app/processing/command';

interface Payload {
  deckId: string;
  userId: string;
  newName: string;
}

export const UPDATE_DECK_NAME_COMMAND = 'decks/update-deck-name';

export class UpdateDeckNameCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(UPDATE_DECK_NAME_COMMAND, payload);
  }
}
