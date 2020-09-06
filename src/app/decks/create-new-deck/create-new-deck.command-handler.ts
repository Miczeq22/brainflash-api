import { CommandHandler } from '@app/processing/command-handler';
import { CreateNewDeckCommand, CREATE_NEW_DECK_COMMAND } from './create-new-deck.command';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { Deck } from '@core/decks/deck/deck.aggregate-root';
import { UniqueDeckChecker } from '@core/decks/deck/rules/user-deck-should-have-unique-name.rule';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { DomainEvents } from '@core/shared/domain-events';

interface Dependencies {
  deckRepository: DeckRepository;
  uniqueDeckChecker: UniqueDeckChecker;
}

export class CreateNewDeckCommandHandler extends CommandHandler<CreateNewDeckCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(CREATE_NEW_DECK_COMMAND);
  }

  public async handle({ payload: { ownerId, ...data } }: CreateNewDeckCommand) {
    const { deckRepository, uniqueDeckChecker } = this.dependencies;

    const deck = await Deck.createNew(
      {
        ownerId: new UniqueEntityID(ownerId),
        ...data,
      },
      uniqueDeckChecker,
    );

    await deckRepository.insert(deck);

    await DomainEvents.dispatchDomainEventsForAggregate(deck.getId());

    return deck.getId().getValue();
  }
}
