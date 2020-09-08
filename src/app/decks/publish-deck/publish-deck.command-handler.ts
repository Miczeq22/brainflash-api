import { CommandHandler } from '@app/processing/command-handler';
import { PublishDeckCommand, PUBLISH_DECK_COMMAND } from './publish-deck.command';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { NotFoundError } from '@errors/not-found.error';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { UnauthenticatedError } from '@errors/unauthenticated.error';

interface Dependencies {
  deckRepository: DeckRepository;
}

export class PublishDeckCommandHandler extends CommandHandler<PublishDeckCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(PUBLISH_DECK_COMMAND);
  }

  public async handle({ payload: { deckId, userId } }: PublishDeckCommand) {
    const { deckRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    if (!deck.getOwnerId().equals(new UniqueEntityID(userId))) {
      throw new UnauthenticatedError('Only deck owner can publish deck.');
    }

    deck.publish();

    await deckRepository.update(deck);
  }
}
