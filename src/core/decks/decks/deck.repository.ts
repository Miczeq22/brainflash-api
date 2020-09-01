import { Deck } from './deck.aggregate-root';

export interface DeckRepository {
  insert(deck: Deck): Promise<void>;
}
