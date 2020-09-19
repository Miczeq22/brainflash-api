import { CommandHandler } from '@app/processing/command-handler';
import { UpdateDeckNameCommand, UPDATE_DECK_NAME_COMMAND } from './update-deck-name.command';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { NotFoundError } from '@errors/not-found.error';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { UniqueDeckChecker } from '@core/decks/deck/rules/user-deck-should-have-unique-name.rule';
import { UnauthenticatedError } from '@errors/unauthenticated.error';
import { DeckReadModelRepository } from '@infrastructure/mongo/domain/decks/deck.read-model';

interface Dependencies {
  deckRepository: DeckRepository;
  uniqueDeckChecker: UniqueDeckChecker;
  deckReadModelRepository: DeckReadModelRepository;
}

export class UpdateDeckNameCommandHandler extends CommandHandler<UpdateDeckNameCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(UPDATE_DECK_NAME_COMMAND);
  }

  public async handle({ payload: { deckId, newName, userId } }: UpdateDeckNameCommand) {
    const { deckRepository, uniqueDeckChecker, deckReadModelRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    if (!deck.getOwnerId().equals(new UniqueEntityID(userId))) {
      throw new UnauthenticatedError('Only deck owner can update deck.');
    }

    await deck.updateName(newName, uniqueDeckChecker);

    await deckRepository.update(deck);

    await deckReadModelRepository.update(deck);
  }
}
