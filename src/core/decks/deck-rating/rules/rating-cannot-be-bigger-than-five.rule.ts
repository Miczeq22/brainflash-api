import { BusinessRule } from '@core/shared/business-rule';

export class RatingCannotBeBiggerThanFiveRule extends BusinessRule {
  message = 'Rating cannot be bigger than five.';

  constructor(private readonly rating: number) {
    super();
  }

  public isBroken() {
    return this.rating > 5;
  }
}
