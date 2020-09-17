import { ScheduledDeck } from './scheduled-deck.entity';

export interface ScheduledDeckRepository {
  insert(scheduledDeck: ScheduledDeck): Promise<void>;

  findAllByUser(userId: string): Promise<ScheduledDeck[]>;
}
