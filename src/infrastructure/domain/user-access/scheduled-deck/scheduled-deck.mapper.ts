import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { ScheduledDeck } from '@core/user-access/scheduled-deck/scheduled-deck.entity';

interface ScheduledDeckRecord {
  id: string;
  deck_id: string;
  user_id: string;
  owner_id: string;
  scheduled_date: string;
  scheduled_at: string;
}

export const SCHEDULED_DECK_TABLE = 'public.scheduled_deck';

export class ScheduledDeckMapper {
  public static toPersistence(scheduledDeck: ScheduledDeck): ScheduledDeckRecord {
    return {
      id: new UniqueEntityID().getValue(),
      deck_id: scheduledDeck.getId().getValue(),
      user_id: scheduledDeck.getUserId().getValue(),
      owner_id: scheduledDeck.getOwnerId().getValue(),
      scheduled_at: scheduledDeck.getScheduledAt().toISOString(),
      scheduled_date: scheduledDeck.getScheduledDate().toISOString(),
    };
  }

  public static toEntity({
    owner_id,
    scheduled_at,
    scheduled_date,
    user_id,
    deck_id,
    ...record
  }: ScheduledDeckRecord): ScheduledDeck {
    return ScheduledDeck.instanceExisting(
      {
        ...record,
        ownerId: new UniqueEntityID(owner_id),
        userId: new UniqueEntityID(user_id),
        scheduledAt: new Date(scheduled_at),
        scheduledDate: new Date(scheduled_date),
      },
      new UniqueEntityID(deck_id),
    );
  }
}
