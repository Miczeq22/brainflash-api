import { DomainEvent } from './domain-event';
import { Entity } from './entity';
import { DomainEvents } from './domain-events';

export abstract class AggregateRoot<T> extends Entity<T> {
  private domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent) {
    this.domainEvents.push(event);

    DomainEvents.markAggregateForDispatch(this);
  }

  public getDomainEvents() {
    return [...this.domainEvents];
  }

  public clearDomainEvents() {
    this.domainEvents = [];
  }
}
