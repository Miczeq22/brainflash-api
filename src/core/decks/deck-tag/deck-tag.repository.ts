import { DeckTag } from './deck-tag.entity';

export interface DeckTagRepository {
  insert(deckTag: DeckTag): Promise<void>;

  findAllByDeck(deckId: string): Promise<DeckTag[]>;
}
