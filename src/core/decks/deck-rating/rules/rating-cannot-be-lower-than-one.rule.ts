import { BusinessRule } from '@core/shared/business-rule';

export class RatingCannotBeLowerThanOneRule extends BusinessRule {
  message = 'Rating cannot be lower than one.';

  constructor(private readonly rating: number) {
    super();
  }

  public isBroken() {
    return this.rating < 1;
  }
}
