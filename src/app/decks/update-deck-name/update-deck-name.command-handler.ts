import { CommandHandler } from '@app/processing/command-handler';
import { UpdateDeckNameCommand, UPDATE_DECK_NAME_COMMAND } from './update-deck-name.command';
import { DeckRepository } from '@core/decks/decks/deck.repository';
import { NotFoundError } from '@errors/not-found.error';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { UnauthorizedError } from '@errors/unauthorized.error';
import { UniqueDeckChecker } from '@core/decks/decks/rules/user-deck-should-have-unique-name.rule';

interface Dependencies {
  deckRepository: DeckRepository;
  uniqueDeckChecker: UniqueDeckChecker;
}

export class UpdateDeckNameCommandHandler extends CommandHandler<UpdateDeckNameCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(UPDATE_DECK_NAME_COMMAND);
  }

  public async handle({ payload: { deckId, newName, userId } }: UpdateDeckNameCommand) {
    const { deckRepository, uniqueDeckChecker } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    if (!deck.getOwnerId().equals(new UniqueEntityID(userId))) {
      throw new UnauthorizedError('Only deck owner can update deck.');
    }

    await deck.updateName(newName, uniqueDeckChecker);

    await deckRepository.update(deck);
  }
}
