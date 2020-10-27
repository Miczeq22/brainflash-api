import { Command } from '@app/processing/command';

interface Payload {
  deckId: string;
  userId: string;
}

export const DELETE_IMAGE_COMMAND_TYPE = 'decks/delete-image';

export class DeleteImageCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(DELETE_IMAGE_COMMAND_TYPE, payload);
  }
}
