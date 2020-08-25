import { DomainEvent } from './domain-event';

export abstract class DomainSubscriber<T extends DomainEvent> {
  public abstract setupSubscriptions(): void;
}
