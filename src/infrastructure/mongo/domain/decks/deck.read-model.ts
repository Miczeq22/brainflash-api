import { Deck } from '@core/decks/deck/deck.aggregate-root';

export interface DeckReadModel {
  id: string;
  name: string;
  description: string;
  tags: string[];
  deleted: boolean;
  published: boolean;
  imageUrl?: string;
  owner: string;
  createdAt: string;
  cardCount: number;
}

export interface DeckReadModelRepository {
  insert(deck: Deck): Promise<void>;

  findById(id: string): Promise<DeckReadModel | null>;
}

export const DECK_READ_MODEL_COLLECTION = 'decks';

export class DeckReadModelMapper {
  public static toPersistence(deck: Deck, owner: string, cardCount: number): DeckReadModel {
    return {
      cardCount,
      owner,
      id: deck.getId().getValue(),
      description: deck.getDescription(),
      name: deck.getName(),
      tags: deck.getTags(),
      createdAt: deck.getCreatedAt().toISOString(),
      deleted: deck.isDeleted(),
      published: deck.isPublished(),
      imageUrl: deck.getImageUrl(),
    };
  }
}
