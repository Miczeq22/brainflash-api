import { DomainEvent } from '@core/shared/domain-event';

export const ACCOUNT_REGISTERED_DOMAIN_EVENT = 'user-registration/registered';

export class UserRegisteredDomainEvent extends DomainEvent {
  constructor(
    public readonly email: string,
    public readonly username: string,
    public readonly userId: string,
  ) {
    super(ACCOUNT_REGISTERED_DOMAIN_EVENT);
  }
}
