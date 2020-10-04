import { DeckRatingRepository } from '@core/decks/deck-rating/deck-rating.repository';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import {
  AddedNewRatingToDeckEvent,
  ADDED_NEW_RATING_TO_DECK_EVENT,
} from '@core/decks/deck/events/added-new-rating-to-deck.domain-event';
import { DomainEvents } from '@core/shared/domain-events';
import { DomainSubscriber } from '@core/shared/domain-subscriber';
import { DeckReadModelRepository } from '@infrastructure/mongo/domain/decks/deck.read-model';

interface Dependencies {
  deckRatingRepository: DeckRatingRepository;
  deckReadModelRepository: DeckReadModelRepository;
  deckRepository: DeckRepository;
}

export class AddedNewRatingSubscriber extends DomainSubscriber<AddedNewRatingToDeckEvent> {
  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public setupSubscriptions() {
    DomainEvents.register(this.insertOrUpdateRating.bind(this), ADDED_NEW_RATING_TO_DECK_EVENT);
  }

  private async insertOrUpdateRating(event: AddedNewRatingToDeckEvent) {
    const { deckRatingRepository, deckReadModelRepository, deckRepository } = this.dependencies;

    const existingRating = await deckRatingRepository.findByUserAndDeck(
      event.deckRating.getUserId(),
      event.deckRating.getDeckId(),
    );

    if (existingRating) {
      existingRating.updateRating(event.deckRating.getRating());
      await deckRatingRepository.update(existingRating);
    } else {
      await deckRatingRepository.insert(event.deckRating);
    }

    const deck = await deckRepository.findById(event.deckRating.getDeckId().getValue());

    await deckReadModelRepository.update(deck);
  }
}
