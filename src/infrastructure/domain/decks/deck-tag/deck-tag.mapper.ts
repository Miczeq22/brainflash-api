import { DeckTag } from '@core/decks/deck-tag/deck-tag.entity';

export interface DeckTagRecord {
  id: string;
  deck_id: string;
  tag_id: string;
}

export const DECK_TAG_TABLE = 'public.deck_tag';

export class DeckTagMapper {
  public static toPersistence(deckTag: DeckTag): DeckTagRecord {
    return {
      id: deckTag.getId().getValue(),
      deck_id: deckTag.getDeckId().getValue(),
      tag_id: deckTag.getTagId().getValue(),
    };
  }
}
