import { AggregateRoot } from '@core/shared/aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { ScheduledDeck } from '../scheduled-deck/scheduled-deck.entity';
import { DeckUnscheduledDomainEvent } from './events/deck-unscheduled.domain-event';
import { NewDeckScheduledDomainEvent } from './events/new-deck-scheduled.domain-event';
import { DeckCannotBeScheduledMoreThanOnceRule } from './rules/deck-cannot-be-scheduled-more-than-once.rule';
import { DeckShouldBeScheduledRule } from './rules/deck-should-be-scheduled.rule';

interface DeckSchedulerProps {
  userId: UniqueEntityID;
  scheduledDecks: ScheduledDeck[];
}

export class DeckScheduler extends AggregateRoot<DeckSchedulerProps> {
  private constructor(props: DeckSchedulerProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static instanceExisting(props: DeckSchedulerProps) {
    return new DeckScheduler(props);
  }

  public scheduleNewDeck(deck: ScheduledDeck) {
    DeckScheduler.checkRule(
      new DeckCannotBeScheduledMoreThanOnceRule(this.props.scheduledDecks, deck),
    );

    this.props.scheduledDecks = [...this.props.scheduledDecks, deck];

    this.addDomainEvent(new NewDeckScheduledDomainEvent(deck));
  }

  public unscheduleDeck(deck: ScheduledDeck) {
    DeckScheduler.checkRule(new DeckShouldBeScheduledRule(this.props.scheduledDecks, deck));

    this.props.scheduledDecks = this.props.scheduledDecks.filter(
      (scheduledDeck) => !scheduledDeck.getId().equals(deck.getId()),
    );

    this.addDomainEvent(new DeckUnscheduledDomainEvent(deck));
  }

  public getUserId() {
    return this.props.userId;
  }

  public getScheduledDecks() {
    return [...this.props.scheduledDecks];
  }
}
