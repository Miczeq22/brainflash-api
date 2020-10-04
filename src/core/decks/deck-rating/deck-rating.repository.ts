import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { DeckRating } from './deck-rating.entity';

export interface DeckRatingRepository {
  insert(deckRating: DeckRating): Promise<void>;

  update(deckRating: DeckRating): Promise<void>;

  findByDeck(deckId: UniqueEntityID): Promise<DeckRating[]>;

  findByUserAndDeck(userId: UniqueEntityID, deckId: UniqueEntityID): Promise<DeckRating | null>;

  remove(id: UniqueEntityID): Promise<void>;
}
