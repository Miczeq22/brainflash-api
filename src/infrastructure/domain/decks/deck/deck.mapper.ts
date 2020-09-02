import { Deck } from '@core/decks/decks/deck.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

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

  public static toEntity(
    { id, created_at, owner_id, image_url, ...record }: DeckRecord,
    cardIDs: UniqueEntityID[] = [],
    tags: string[] = [],
  ): Deck {
    return Deck.instanceExisting(
      {
        ...record,
        cardIDs,
        createdAt: new Date(created_at),
        ownerId: new UniqueEntityID(owner_id),
        tags,
        imageUrl: image_url,
      },
      new UniqueEntityID(id),
    );
  }
}
