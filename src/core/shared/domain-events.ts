import { AggregateRoot } from './aggregate-root';
import { UniqueEntityID } from './unique-entity-id';
import { DomainEvent } from './domain-event';

export class DomainEvents {
  private static handlersMap = new Map<string, Function[]>();

  private static markedAggregates: AggregateRoot<unknown>[] = [];

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const isExistingAggregate = this.markedAggregates.some((markedAggregate) =>
      markedAggregate.getId().equals(aggregate.getId()),
    );

    if (!isExistingAggregate) {
      this.markedAggregates.push(aggregate);
    }
  }

  public static async dispatchDomainEventsForAggregate(id: UniqueEntityID) {
    const aggregate = this.markedAggregates.find((markedAggregate) =>
      markedAggregate.getId().equals(id),
    );

    if (aggregate) {
      const promises = aggregate.getDomainEvents().map((event) => this.dispatch(event));
      aggregate.clearDomainEvents();

      await Promise.all(promises);
      this.markedAggregates = this.markedAggregates.filter(
        (existingAggregate) => !existingAggregate.equals(aggregate),
      );
    }
  }

  public static register(callback: (event: DomainEvent) => void, eventName: string) {
    if (!this.handlersMap.has(eventName)) {
      this.handlersMap.set(eventName, []);
    }

    this.handlersMap.set(eventName, [...this.handlersMap.get(eventName), callback]);
  }

  public static clearHandlers() {
    this.handlersMap.clear();
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = [];
  }

  private static async dispatch(event: DomainEvent) {
    if (this.handlersMap.has(event.name)) {
      const handlers = this.handlersMap.get(event.name);

      for (const handler of handlers) {
        handler(event);
      }
    }
  }
}
