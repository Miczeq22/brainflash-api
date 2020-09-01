import { Command } from '@app/processing/command';

interface Payload {
  name: string;
  description: string;
  tags: string[];
  ownerId: string;
  imageUrl?: string;
}

export const CREATE_NEW_DECK_COMMAND = 'decks/create-new-deck';

export class CreateNewDeckCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(CREATE_NEW_DECK_COMMAND, payload);
  }
}
