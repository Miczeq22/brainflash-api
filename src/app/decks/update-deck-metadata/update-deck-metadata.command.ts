import { Command } from '@app/processing/command';

interface Payload {
  userId: string;
  deckId: string;
  description?: string;
  tags?: string[];
  imageUrl?: string;
}

export const UPDATE_DECK_METADATA_COMMAND = 'decks/update-deck-metadata';

export class UpdateDeckMetadataCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(UPDATE_DECK_METADATA_COMMAND, payload);
  }
}
