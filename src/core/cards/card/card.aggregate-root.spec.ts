import { Card } from './card.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

describe('[Domain] Card', () => {
  test('should create new card with proper props', () => {
    const card = Card.createNew({
      question: '#question',
      answer: '#answer',
      deckId: new UniqueEntityID(),
    });

    expect(card.getCreatedAt()).toBeTruthy();
  });
});
