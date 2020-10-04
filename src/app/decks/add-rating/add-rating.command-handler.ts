import { CommandHandler } from '@app/processing/command-handler';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { DomainEvents } from '@core/shared/domain-events';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { NotFoundError } from '@errors/not-found.error';
import { AddRatingCommand, ADD_RATING_COMMAND } from './add-rating.command';

interface Dependencies {
  deckRepository: DeckRepository;
}

export class AddRatingCommandHandler extends CommandHandler<AddRatingCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(ADD_RATING_COMMAND);
  }

  public async handle({ payload: { deckId, rating, userId } }: AddRatingCommand) {
    const { deckRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    deck.addRating(new UniqueEntityID(userId), rating);

    await DomainEvents.dispatchDomainEventsForAggregate(deck.getId());
  }
}
