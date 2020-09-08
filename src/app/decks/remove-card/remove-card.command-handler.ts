import { CommandHandler } from '@app/processing/command-handler';
import { RemoveCardCommand, REMOVE_CARD_COMMAND } from './remove-card.command';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { NotFoundError } from '@errors/not-found.error';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { DomainEvents } from '@core/shared/domain-events';
import { UnauthenticatedError } from '@errors/unauthenticated.error';

interface Dependencies {
  deckRepository: DeckRepository;
}

export class RemoveCardCommandHandler extends CommandHandler<RemoveCardCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(REMOVE_CARD_COMMAND);
  }

  public async handle({ payload: { cardId, userId, deckId } }: RemoveCardCommand) {
    const { deckRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    if (!deck.getOwnerId().equals(new UniqueEntityID(userId))) {
      throw new UnauthenticatedError('Only deck owner can remove card.');
    }

    deck.removeCard(new UniqueEntityID(cardId));

    await DomainEvents.dispatchDomainEventsForAggregate(deck.getId());
  }
}
