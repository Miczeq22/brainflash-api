import { Deck } from '@core/decks/decks/deck.aggregate-root';

interface DeckRecord {
  id: string;
  name: string;
  description: string;
  image_url?: string | null;
  owner_id: string;
  created_at: string;
}

export const DECK_TABLE = 'public.deck';

export class DeckMapper {
  public static toPersistence(deck: Deck): DeckRecord {
    return {
      id: deck.getId().getValue(),
      name: deck.getName(),
      description: deck.getDescription(),
      image_url: deck.getImageUrl(),
      created_at: deck.getCreatedAt().toISOString(),
      owner_id: deck.getOwnerId().getValue(),
    };
  }
}
