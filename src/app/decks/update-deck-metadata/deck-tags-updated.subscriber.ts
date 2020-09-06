import { DomainSubscriber } from '@core/shared/domain-subscriber';
import {
  DeckTagsUpdatedDomainEvent,
  DECK_TAGS_UPDATED_DOMAIN_EVENT,
} from '@core/decks/deck/events/deck-tags-updated.domain-event';
import { DomainEvents } from '@core/shared/domain-events';
import { DeckTagRepository } from '@core/decks/deck-tag/deck-tag.repository';
import { TagRepository } from '@core/decks/tags/tag.repository';
import { Logger } from '@infrastructure/logger/logger';
import { DeckRepository } from '@core/decks/deck/deck.repository';

interface Dependencies {
  deckTagRepository: DeckTagRepository;
  deckRepository: DeckRepository;
  tagRepository: TagRepository;
  logger: Logger;
}

export class DeckTagsUpdatedSubscriber extends DomainSubscriber<DeckTagsUpdatedDomainEvent> {
  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public setupSubscriptions() {
    DomainEvents.register(this.updateDeckTagsInDatabase.bind(this), DECK_TAGS_UPDATED_DOMAIN_EVENT);
  }

  public async updateDeckTagsInDatabase({ deckId, newTags }: DeckTagsUpdatedDomainEvent) {
    const { deckTagRepository, tagRepository, logger, deckRepository } = this.dependencies;

    const oldDeckTags = await deckTagRepository.findAllByDeck(deckId.getValue());

    const oldTagsPromises = oldDeckTags.map((deckTag) =>
      tagRepository.findById(deckTag.getTagId().getValue()),
    );

    const oldTags = await Promise.all(oldTagsPromises);

    const oldTagNames = oldTags.map((tag) => tag.getName());

    const tagsToSave = newTags.filter((tag) => !oldTagNames.includes(tag));
    const tagsToRemove = oldTagNames
      .filter((tag) => !newTags.includes(tag))
      .map((tag) => oldTags.find((oldTag) => oldTag.getName() === tag).getName());

    await Promise.all([
      deckRepository.addTags(deckId, tagsToSave),
      deckRepository.removeTags(deckId, tagsToRemove),
    ]);

    logger.info('Deck tags updated.');
  }
}
