import { BusinessRule } from '@core/shared/business-rule';

export interface UniqueEmailChecker {
  isUnique(email: string): Promise<boolean>;
}

export class UserShouldHaveUniqueEmailRule extends BusinessRule {
  message = `Email address: "${this.email}" is already taken.`;

  constructor(private readonly email: string, private readonly emailChecker: UniqueEmailChecker) {
    super();
  }

  public async isBroken() {
    return !(await this.emailChecker.isUnique(this.email));
  }
}
