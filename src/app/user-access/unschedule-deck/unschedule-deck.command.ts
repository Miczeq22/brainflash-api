import { Command } from '@app/processing/command';

interface Payload {
  userId: string;
  deckId: string;
}

export const UNSCHEDULE_DECK_COMMAND = 'user-access/unschedule-deck';

export class UnscheduleDeckCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(UNSCHEDULE_DECK_COMMAND, payload);
  }
}
