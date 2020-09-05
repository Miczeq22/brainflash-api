import { Card } from '@core/cards/card/card.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

interface CardRecord {
  id: string;
  deck_id: string;
  question: string;
  answer: string;
  created_at: string;
}

export const CARD_TABLE = 'public.card';

export class CardMapper {
  public static toPersistence(card: Card): CardRecord {
    return {
      id: card.getId().getValue(),
      deck_id: card.getDeckId().getValue(),
      question: card.getQuestion(),
      answer: card.getAnswer(),
      created_at: card.getCreatedAt().toISOString(),
    };
  }

  public static toEntity({ deck_id, created_at, id, ...record }: CardRecord): Card {
    return Card.instanceExisting(
      {
        deckId: new UniqueEntityID(deck_id),
        createdAt: new Date(created_at),
        ...record,
      },
      new UniqueEntityID(id),
    );
  }
}
