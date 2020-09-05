import { AggregateRoot } from '@core/shared/aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

interface CardProps {
  deckId: UniqueEntityID;
  question: string;
  answer: string;
  createdAt: Date;
}

interface NewCardProps {
  deckId: UniqueEntityID;
  question: string;
  answer: string;
}

export class Card extends AggregateRoot<CardProps> {
  private constructor(props: CardProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew(props: NewCardProps) {
    return new Card({
      ...props,
      createdAt: new Date(),
    });
  }

  public static instanceExisting(props: CardProps, id: UniqueEntityID) {
    return new Card(props, id);
  }

  public getDeckId() {
    return this.props.deckId;
  }

  public getQuestion() {
    return this.props.question;
  }

  public getAnswer() {
    return this.props.answer;
  }

  public getCreatedAt() {
    return this.props.createdAt;
  }
}
