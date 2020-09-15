import { CardProps, Card } from '@core/cards/card/card.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

export const createCardMock = (props: Partial<CardProps> = {}): Card =>
  Card.instanceExisting(
    {
      answer: '#answer',
      question: '#question',
      deckId: new UniqueEntityID(),
      createdAt: new Date(),
      ...props,
    },
    new UniqueEntityID(),
  );
