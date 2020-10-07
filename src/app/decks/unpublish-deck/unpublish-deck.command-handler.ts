import { CommandHandler } from '@app/processing/command-handler';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { DomainEvents } from '@core/shared/domain-events';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { NotFoundError } from '@errors/not-found.error';
import { UnauthenticatedError } from '@errors/unauthenticated.error';
import { UnpublishDeckCommand, UNPUBLISH_DECK_COMMAND } from './unpublish-deck.command';

interface Dependencies {
  deckRepository: DeckRepository;
}

export class UnpublishDeckCommandHandler extends CommandHandler<UnpublishDeckCommand> {
  constructor(private readonly dependecies: Dependencies) {
    super(UNPUBLISH_DECK_COMMAND);
  }

  public async handle({ payload: { deckId, userId } }: UnpublishDeckCommand) {
    const { deckRepository } = this.dependecies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    if (!deck.getOwnerId().equals(new UniqueEntityID(userId))) {
      throw new UnauthenticatedError('Only deck owner can unpublish deck.');
    }

    deck.unpublish();

    await deckRepository.update(deck);

    await DomainEvents.dispatchDomainEventsForAggregate(deck.getId());
  }
}
