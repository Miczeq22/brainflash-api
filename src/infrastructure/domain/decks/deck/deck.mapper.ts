import { Deck } from '@core/decks/deck/deck.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { Card } from '@core/decks/card/card.entity';

interface DeckRecord {
  id: string;
  name: string;
  description: string;
  deleted: boolean;
  published: boolean;
  image_url?: string | null;
  owner_id: string;
  created_at: string;
}

export const DECK_TABLE = 'public.deck';

export const USER_DECK_TABLE = 'public.user_deck';

export class DeckMapper {
  public static toPersistence(deck: Deck): DeckRecord {
    return {
      id: deck.getId().getValue(),
      name: deck.getName(),
      description: deck.getDescription(),
      deleted: deck.isDeleted(),
      image_url: deck.getImageUrl(),
      created_at: deck.getCreatedAt().toISOString(),
      owner_id: deck.getOwnerId().getValue(),
      published: deck.isPublished(),
    };
  }

  public static toEntity(
    { id, created_at, owner_id, image_url, ...record }: DeckRecord,
    cards: Card[] = [],
    tags: string[] = [],
  ): Deck {
    return Deck.instanceExisting(
      {
        ...record,
        cards,
        createdAt: new Date(created_at),
        ownerId: new UniqueEntityID(owner_id),
        tags,
        imageUrl: image_url,
      },
      new UniqueEntityID(id),
    );
  }
}
