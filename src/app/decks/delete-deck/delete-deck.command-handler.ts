import { CommandHandler } from '@app/processing/command-handler';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { DeleteDeckCommand, DELETE_DECK_COMMAND } from './delete-deck.command';
import { NotFoundError } from '@errors/not-found.error';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

interface Dependencies {
  deckRepository: DeckRepository;
}

export class DeleteDeckCommandHandler extends CommandHandler<DeleteDeckCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(DELETE_DECK_COMMAND);
  }

  public async handle({ payload: { deckId, userId } }: DeleteDeckCommand) {
    const { deckRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    if (!deck.getOwnerId().equals(new UniqueEntityID(userId))) {
      throw new NotFoundError('Only deck owner can delete deck.');
    }

    deck.delete();

    await deckRepository.update(deck);
  }
}
