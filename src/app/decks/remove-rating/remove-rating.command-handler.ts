import { CommandHandler } from '@app/processing/command-handler';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { DeckRateChecker } from '@core/decks/deck/rules/user-should-assessed-deck.rule';
import { DomainEvents } from '@core/shared/domain-events';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { NotFoundError } from '@errors/not-found.error';
import { RemoveRatingCommand, REMOVE_RATING_COMMAND } from './remove-rating.command';

interface Dependencies {
  deckRepository: DeckRepository;
  deckRateChecker: DeckRateChecker;
}

export class RemoveRatingCommandHandler extends CommandHandler<RemoveRatingCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(REMOVE_RATING_COMMAND);
  }

  public async handle({ payload: { deckId, userId } }: RemoveRatingCommand) {
    const { deckRateChecker, deckRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    await deck.removeRating(new UniqueEntityID(userId), deckRateChecker);

    await DomainEvents.dispatchDomainEventsForAggregate(deck.getId());
  }
}
