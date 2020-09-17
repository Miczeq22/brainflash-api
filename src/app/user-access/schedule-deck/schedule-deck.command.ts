import { Command } from '@app/processing/command';

interface Payload {
  deckId: string;
  userId: string;
  scheduledDate: string;
}

export const SCHEDULE_DECK_COMMAND = 'user-access/schedule-deck';

export class ScheduleDeckCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(SCHEDULE_DECK_COMMAND, payload);
  }
}
