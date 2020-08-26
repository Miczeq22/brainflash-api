import { ValueObject } from '@core/shared/value-object';

interface AccountStatusProps {
  value: string;
}

export class AccountStatus extends ValueObject<AccountStatusProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static WaitingForConfirmation = new AccountStatus('WaitingForConfirmation');

  public static Confirmed = new AccountStatus('Confirmed');

  public static Expired = new AccountStatus('Expired');

  public getValue() {
    return this.props.value;
  }
}
