import { BusinessRule } from '@core/shared/business-rule';
import { AccountStatus } from '../account-status.value-object';

export class AccountCannotBeExpiredRule extends BusinessRule {
  message = 'Cannot activate already expired account.';

  constructor(private readonly accountStatus: string) {
    super();
  }

  public isBroken() {
    return this.accountStatus === AccountStatus.Expired.getValue();
  }
}
