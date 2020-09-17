import { Entity } from '@core/shared/entity';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { DeckCannotBeDeletedRule } from './rules/deck-cannot-be-deleted.rule';
import { OnlyDeckOwnerCanScheduleUnpublishedDeckRule } from './rules/only-deck-owner-can-schedule-unpublished-deck.rule';

interface ScheduledDeckProps {
  ownerId: UniqueEntityID;
  userId: UniqueEntityID;
  scheduledDate: Date;
  scheduledAt: Date;
}

interface CreateNewProps {
  deckId: UniqueEntityID;
  ownerId: UniqueEntityID;
  userId: UniqueEntityID;
  published: boolean;
  deleted: boolean;
  scheduledDate: Date;
}

export class ScheduledDeck extends Entity<ScheduledDeckProps> {
  private constructor(props: ScheduledDeckProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew({ userId, deckId, ...props }: CreateNewProps) {
    ScheduledDeck.checkRule(new DeckCannotBeDeletedRule(props.deleted));
    ScheduledDeck.checkRule(
      new OnlyDeckOwnerCanScheduleUnpublishedDeckRule(props.published, props.ownerId, userId),
    );

    return new ScheduledDeck(
      {
        ...props,
        userId,
        scheduledAt: new Date(),
      },
      deckId,
    );
  }

  public static instanceExisting(props: ScheduledDeckProps, id: UniqueEntityID) {
    return new ScheduledDeck(props, id);
  }

  public getOwnerId() {
    return this.props.ownerId;
  }

  public getScheduledAt() {
    return this.props.scheduledAt;
  }

  public getScheduledDate() {
    return this.props.scheduledDate;
  }

  public getUserId() {
    return this.props.userId;
  }
}
