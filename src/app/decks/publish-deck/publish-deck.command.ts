import { Command } from '@app/processing/command';

interface Payload {
  userId: string;
  deckId: string;
}

export const PUBLISH_DECK_COMMAND = 'decks/publish-deck';

export class PublishDeckCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(PUBLISH_DECK_COMMAND, payload);
  }
}
