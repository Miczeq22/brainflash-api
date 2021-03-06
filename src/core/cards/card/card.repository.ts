import { Card } from './card.aggregate-root';

export interface CardRepository {
  insert(card: Card): Promise<void>;

  remove(id: string): Promise<void>;
}
