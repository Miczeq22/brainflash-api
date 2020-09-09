import { DomainSubscriber } from '@core/shared/domain-subscriber';
import {
  DeckCreatedDomainEvent,
  DECK_CREATED_DOMAIN_EVENT,
} from '@core/decks/deck/events/deck-created.domain-event';
import { TagRepository } from '@core/decks/tags/tag.repository';
import { DomainEvents } from '@core/shared/domain-events';
import { Logger } from '@infrastructure/logger/logger';
import { Tag } from '@core/decks/tags/tag.entity';
import { DeckTagRepository } from '@core/decks/deck-tag/deck-tag.repository';
import { DeckTag } from '@core/decks/deck-tag/deck-tag.entity';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { DeckReadModelRepository } from '@infrastructure/mongo/domain/decks/deck.read-model';

interface Dependencies {
  tagRepository: TagRepository;
  deckTagRepository: DeckTagRepository;
  deckReadModelRepository: DeckReadModelRepository;
  logger: Logger;
}

export class DeckCreatedSubscriber extends DomainSubscriber<DeckCreatedDomainEvent> {
  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public setupSubscriptions() {
    DomainEvents.register(this.insertDeckTags.bind(this), DECK_CREATED_DOMAIN_EVENT);
    DomainEvents.register(this.saveReadModel.bind(this), DECK_CREATED_DOMAIN_EVENT);
  }

  public async insertDeckTags({ deck }: DeckCreatedDomainEvent) {
    const { logger } = this.dependencies;

    const insertPromises = deck.getTags().map((tag) => this.insertTagIfNotExist(tag, deck.getId()));

    await Promise.all(insertPromises);

    logger.info('Added deck tags to database.');
  }

  public async saveReadModel({ deck }: DeckCreatedDomainEvent) {
    const { deckReadModelRepository, logger } = this.dependencies;

    await deckReadModelRepository.insert(deck);

    logger.info('Deck read model saved.');
  }

  private async insertTagIfNotExist(tag: string, deckId: UniqueEntityID) {
    const { tagRepository, deckTagRepository } = this.dependencies;
    const existingTag = await tagRepository.findByName(tag);

    if (!existingTag) {
      const newTag = Tag.createNew(tag);

      await tagRepository.insert(newTag);
      await deckTagRepository.insert(DeckTag.createNew(deckId, newTag.getId()));
    } else {
      await deckTagRepository.insert(DeckTag.createNew(deckId, existingTag.getId()));
    }
  }
}
