import { DeckRating } from '@core/decks/deck-rating/deck-rating.entity';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

interface DeckRatingRecord {
  id: string;
  user_id: string;
  deck_id: string;
  rating: number;
}

export const DECK_RATING_TABLE = 'public.deck_rating';

export class DeckRatingMapper {
  public static toPersistence(deckRating: DeckRating): DeckRatingRecord {
    return {
      id: deckRating.getId().getValue(),
      deck_id: deckRating.getDeckId().getValue(),
      user_id: deckRating.getUserId().getValue(),
      rating: deckRating.getRating(),
    };
  }

  public static toEntity(record: DeckRatingRecord): DeckRating {
    return DeckRating.instanceExisting(
      {
        ...record,
        deckId: new UniqueEntityID(record.deck_id),
        userId: new UniqueEntityID(record.user_id),
      },
      new UniqueEntityID(record.id),
    );
  }
}
