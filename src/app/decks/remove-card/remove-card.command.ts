import { Command } from '@app/processing/command';

interface Payload {
  userId: string;
  cardId: string;
  deckId: string;
}

export const REMOVE_CARD_COMMAND = 'decks/remove-card';

export class RemoveCardCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(REMOVE_CARD_COMMAND, payload);
  }
}
