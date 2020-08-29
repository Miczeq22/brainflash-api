import { BusinessRule } from '@core/shared/business-rule';
import { AccountStatus } from '../account-status.value-object';

export class AccountCannotBeActivatedMoreThanOnceRule extends BusinessRule {
  message = 'Account is already confirmed. Account cannot be actived more than once.';

  constructor(private readonly accountStatus: string) {
    super();
  }

  public isBroken() {
    return this.accountStatus === AccountStatus.Confirmed.getValue();
  }
}
