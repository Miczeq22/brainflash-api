import { Deck } from './deck.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

export interface DeckRepository {
  insert(deck: Deck): Promise<void>;

  update(deck: Deck): Promise<void>;

  findById(id: string): Promise<Deck | null>;

  removeTags(deckId: UniqueEntityID, tags: string[]): Promise<void>;

  addTags(deckId: UniqueEntityID, tags: string[]): Promise<void>;

  enrollUser(userId: string, deckId: string): Promise<void>;

  isUserEnrolled(userId: string, deckId: string): Promise<boolean>;
}
