import { Entity } from '@core/shared/entity';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

interface CardProps {
  question: string;
  answer: string;
}

export class Card extends Entity<CardProps> {
  private constructor(props: CardProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew(props: CardProps) {
    return new Card(props);
  }

  public static instanceExisting(props: CardProps, id: UniqueEntityID) {
    return new Card(props, id);
  }

  public getQuestion() {
    return this.props.question;
  }

  public getAnswer() {
    return this.props.answer;
  }
}
