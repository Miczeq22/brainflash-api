import { AddNewCardCommand, ADD_NEW_CARD_COMMAND } from './add-new-card.command';
import { CommandHandler } from '@app/processing/command-handler';
import { DeckRepository } from '@core/decks/decks/deck.repository';
import { NotFoundError } from '@errors/not-found.error';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { UnauthorizedError } from '@errors/unauthorized.error';
import { Card } from '@core/decks/card/card.entity';
import { DomainEvents } from '@core/shared/domain-events';

interface Dependencies {
  deckRepository: DeckRepository;
}

export class AddNewCardCommandHandler extends CommandHandler<AddNewCardCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(ADD_NEW_CARD_COMMAND);
  }

  public async handle({ payload: { answer, question, deckId, userId } }: AddNewCardCommand) {
    const { deckRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    if (!deck.getOwnerId().equals(new UniqueEntityID(userId))) {
      throw new UnauthorizedError('Only deck owner can add card.');
    }

    const card = Card.createNew({ answer, question });

    deck.addCard(card);

    await DomainEvents.dispatchDomainEventsForAggregate(deck.getId());

    return card.getId().getValue();
  }
}
