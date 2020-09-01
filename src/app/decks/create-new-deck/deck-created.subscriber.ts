import { DomainSubscriber } from '@core/shared/domain-subscriber';
import {
  DeckCreatedDomainEvent,
  DECK_CREATED_DOMAIN_EVENT,
} from '@core/decks/decks/events/deck-created.domain-event';
import { TagRepository } from '@core/decks/tags/tag.repository';
import { DomainEvents } from '@core/shared/domain-events';
import { Logger } from '@infrastructure/logger/logger';
import { Tag } from '@core/decks/tags/tag.entity';
import { DeckTagRepository } from '@core/decks/deck-tag/deck-tag.repository';
import { DeckTag } from '@core/decks/deck-tag/deck-tag.entity';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

interface Dependencies {
  tagRepository: TagRepository;
  deckTagRepository: DeckTagRepository;
  logger: Logger;
}

export class DeckCreatedSubscriber extends DomainSubscriber<DeckCreatedDomainEvent> {
  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public setupSubscriptions() {
    DomainEvents.register(this.insertDeckTags.bind(this), DECK_CREATED_DOMAIN_EVENT);
  }

  public async insertDeckTags({ deckTags, deckId }: DeckCreatedDomainEvent) {
    const { logger } = this.dependencies;

    const insertPromises = deckTags.map((tag) => this.insertTagIfNotExist(tag, deckId));

    await Promise.all(insertPromises);

    logger.info('Added deck tags to database.');
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
