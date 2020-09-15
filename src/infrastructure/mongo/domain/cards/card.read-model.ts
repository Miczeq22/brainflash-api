import { Card } from '@core/cards/card/card.aggregate-root';

export interface CardReadModel {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface CardReadModelRepository {
  insert(card: Card): Promise<void>;

  findAllForDeck(deckId: string): Promise<CardReadModel[]>;
}

export class CardReadModelMapper {
  public static toPersistence(card: Card): CardReadModel {
    return {
      id: card.getId().getValue(),
      answer: card.getAnswer(),
      question: card.getQuestion(),
      createdAt: card.getCreatedAt().toISOString(),
      deckId: card.getDeckId().getValue(),
    };
  }
}
