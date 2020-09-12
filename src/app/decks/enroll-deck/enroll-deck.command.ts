import { Command } from '@app/processing/command';

interface Payload {
  userId: string;
  deckId: string;
}

export const ENROLL_DECK_COMMAND = 'decks/enroll-deck';

export class EnrollDeckCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(ENROLL_DECK_COMMAND, payload);
  }
}
