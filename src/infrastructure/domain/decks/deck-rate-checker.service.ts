import { DeckRatingRepository } from '@core/decks/deck-rating/deck-rating.repository';
import { DeckRateChecker } from '@core/decks/deck/rules/user-should-assessed-deck.rule';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

interface Dependencies {
  deckRatingRepository: DeckRatingRepository;
}

export class DeckRateCheckerService implements DeckRateChecker {
  constructor(private readonly dependencies: Dependencies) {}

  public async isRatedByUser(userId: UniqueEntityID, deckId: UniqueEntityID) {
    const result = await this.dependencies.deckRatingRepository.findByUserAndDeck(userId, deckId);

    return result !== null;
  }
}
