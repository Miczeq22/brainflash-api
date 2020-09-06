import { Command } from '@app/processing/command';

interface Payload {
  userId: string;
  deckId: string;
  question: string;
  answer: string;
}

export const ADD_NEW_CARD_COMMAND = 'decks/add-new-card';

export class AddNewCardCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(ADD_NEW_CARD_COMMAND, payload);
  }
}
