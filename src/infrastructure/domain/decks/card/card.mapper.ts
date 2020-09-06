import { Card } from '@core/decks/card/card.entity';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

interface CardRecord {
  id: string;
  question: string;
  answer: string;
}

export class CardMapper {
  public static toPersistence(card: Card): CardRecord {
    return {
      id: card.getId().getValue(),
      answer: card.getAnswer(),
      question: card.getQuestion(),
    };
  }

  public static toEntity({ id, ...record }: CardRecord): Card {
    return Card.instanceExisting(record, new UniqueEntityID(id));
  }
}
