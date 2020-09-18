import { ScheduledDeck } from './scheduled-deck.entity';

export interface ScheduledDeckRepository {
  insert(scheduledDeck: ScheduledDeck): Promise<void>;

  findAllByUser(userId: string): Promise<ScheduledDeck[]>;

  findByUserAndDeck(userId: string, deckId: string): Promise<ScheduledDeck | null>;

  remove(deckId: string, userId: string): Promise<void>;
}
