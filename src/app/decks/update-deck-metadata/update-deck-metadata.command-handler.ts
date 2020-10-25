import { CommandHandler } from '@app/processing/command-handler';
import {
  UpdateDeckMetadataCommand,
  UPDATE_DECK_METADATA_COMMAND,
} from './update-deck-metadata.command';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { NotFoundError } from '@errors/not-found.error';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { DomainEvents } from '@core/shared/domain-events';
import { UnauthenticatedError } from '@errors/unauthenticated.error';
import { DeckReadModelRepository } from '@infrastructure/mongo/domain/decks/deck.read-model';

interface Dependencies {
  deckRepository: DeckRepository;
  deckReadModelRepository: DeckReadModelRepository;
}

export class UpdateDeckMetadataCommandHandler extends CommandHandler<UpdateDeckMetadataCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(UPDATE_DECK_METADATA_COMMAND);
  }

  public async handle({
    payload: { deckId, userId, description, tags, imageUrl },
  }: UpdateDeckMetadataCommand) {
    const { deckRepository, deckReadModelRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    if (!deck.getOwnerId().equals(new UniqueEntityID(userId))) {
      throw new UnauthenticatedError('Only deck owner can update deck metadata.');
    }

    if (description && description.trim()) {
      deck.updateDescription(description);
    }

    if (tags) {
      deck.updateTags(tags);
    }

    if (imageUrl) {
      deck.updateImageUrl(imageUrl);
    }

    await deckRepository.update(deck);

    await deckReadModelRepository.update(deck);

    await DomainEvents.dispatchDomainEventsForAggregate(deck.getId());
  }
}
