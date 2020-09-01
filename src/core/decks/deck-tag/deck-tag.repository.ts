import { DeckTag } from './deck-tag.entity';

export interface DeckTagRepository {
  insert(deckTag: DeckTag): Promise<void>;
}
