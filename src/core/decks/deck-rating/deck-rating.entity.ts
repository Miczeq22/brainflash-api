import { Entity } from '@core/shared/entity';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { RatingCannotBeBiggerThanFiveRule } from './rules/rating-cannot-be-bigger-than-five.rule';
import { RatingCannotBeLowerThanOneRule } from './rules/rating-cannot-be-lower-than-one.rule';

interface DeckRatingProps {
  userId: UniqueEntityID;
  deckId: UniqueEntityID;
  rating: number;
}

export class DeckRating extends Entity<DeckRatingProps> {
  private constructor(props: DeckRatingProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew(payload: DeckRatingProps) {
    DeckRating.checkRule(new RatingCannotBeBiggerThanFiveRule(payload.rating));
    DeckRating.checkRule(new RatingCannotBeLowerThanOneRule(payload.rating));

    return new DeckRating(payload);
  }

  public static instanceExisting(props: DeckRatingProps, id: UniqueEntityID) {
    return new DeckRating(props, id);
  }

  public updateRating(rating: number) {
    DeckRating.checkRule(new RatingCannotBeBiggerThanFiveRule(rating));
    DeckRating.checkRule(new RatingCannotBeLowerThanOneRule(rating));

    this.props.rating = rating;
  }

  public getUserId() {
    return this.props.userId;
  }

  public getDeckId() {
    return this.props.deckId;
  }

  public getRating() {
    return this.props.rating;
  }
}
