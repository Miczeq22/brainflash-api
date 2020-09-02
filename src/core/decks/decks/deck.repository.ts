import { Deck } from './deck.aggregate-root';

export interface DeckRepository {
  insert(deck: Deck): Promise<void>;

  update(deck: Deck): Promise<void>;

  findById(id: string): Promise<Deck | null>;
}
