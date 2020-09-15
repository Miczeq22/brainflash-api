import { Deck } from '@core/decks/deck/deck.aggregate-root';

export interface FindAllFilter {
  page: number;
  limit: number;
  userId: string;
}

export interface DeckReadModel {
  id: string;
  name: string;
  description: string;
  tags: string[];
  deleted: boolean;
  published: boolean;
  imageUrl?: string;
  ownerName: string;
  ownerId: string;
  createdAt: string;
  cardCount: number;
}

export interface DeckReadModelRepository {
  insert(deck: Deck): Promise<void>;

  findById(id: string): Promise<DeckReadModel | null>;

  findAll(filter: FindAllFilter): Promise<DeckReadModel[]>;
}

export const DECK_READ_MODEL_COLLECTION = 'decks';

export class DeckReadModelMapper {
  public static toPersistence(deck: Deck, ownerName: string, cardCount: number): DeckReadModel {
    return {
      cardCount,
      ownerName,
      id: deck.getId().getValue(),
      description: deck.getDescription(),
      name: deck.getName(),
      tags: deck.getTags(),
      createdAt: deck.getCreatedAt().toISOString(),
      deleted: deck.isDeleted(),
      published: deck.isPublished(),
      imageUrl: deck.getImageUrl(),
      ownerId: deck.getOwnerId().getValue(),
    };
  }
}
