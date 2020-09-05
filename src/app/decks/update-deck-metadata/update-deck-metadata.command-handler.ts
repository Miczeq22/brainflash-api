import { CommandHandler } from '@app/processing/command-handler';
import {
  UpdateDeckMetadataCommand,
  UPDATE_DECK_METADATA_COMMAND,
} from './update-deck-metadata.command';
import { DeckRepository } from '@core/decks/decks/deck.repository';
import { NotFoundError } from '@errors/not-found.error';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { UnauthorizedError } from '@errors/unauthorized.error';
import { DomainEvents } from '@core/shared/domain-events';

interface Dependencies {
  deckRepository: DeckRepository;
}

export class UpdateDeckMetadataCommandHandler extends CommandHandler<UpdateDeckMetadataCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(UPDATE_DECK_METADATA_COMMAND);
  }

  public async handle({
    payload: { deckId, userId, description, tags },
  }: UpdateDeckMetadataCommand) {
    const { deckRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    if (!deck.getOwnerId().equals(new UniqueEntityID(userId))) {
      throw new UnauthorizedError('Only deck owner can update deck metadata.');
    }

    if (description && description.trim()) {
      deck.updateDescription(description);
    }

    if (tags) {
      deck.updateTags(tags);
    }

    await deckRepository.update(deck);

    await DomainEvents.dispatchDomainEventsForAggregate(deck.getId());
  }
}
