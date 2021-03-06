import { createMockProxy } from '@tools/mock-proxy';
import { TagRepository } from '@core/decks/tags/tag.repository';
import { DeckTagRepository } from '@core/decks/deck-tag/deck-tag.repository';
import { Logger } from '@infrastructure/logger/logger';
import { DeckCreatedSubscriber } from './deck-created.subscriber';
import { DeckCreatedDomainEvent } from '@core/decks/deck/events/deck-created.domain-event';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { Tag } from '@core/decks/tags/tag.entity';
import { DeckReadModelRepository } from '@infrastructure/mongo/domain/decks/deck.read-model';
import { createDeckMock } from '@tests/deck.mock';

describe('[App] Deck created subscriber', () => {
  const tagRepository = createMockProxy<TagRepository>();
  const deckTagRepository = createMockProxy<DeckTagRepository>();
  const logger = createMockProxy<Logger>();
  const deckReadModelRepository = createMockProxy<DeckReadModelRepository>();

  beforeEach(() => {
    tagRepository.mockClear();
    deckTagRepository.mockClear();
    logger.mockClear();
    deckReadModelRepository.mockClear();
  });

  test('should insert new tag if does not exist and associate it with deck', async () => {
    tagRepository.findByName.mockResolvedValue(null);

    const subscriber = new DeckCreatedSubscriber({
      deckTagRepository,
      logger,
      tagRepository,
      deckReadModelRepository,
    });

    await subscriber.insertDeckTags(new DeckCreatedDomainEvent(createDeckMock()));

    expect(tagRepository.insert).toHaveBeenCalledTimes(1);
    expect(deckTagRepository.insert).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledTimes(1);
  });

  test('should not insert tag if already exists but it should associate it with deck', async () => {
    tagRepository.findByName.mockResolvedValue(
      Tag.instanceExisting(
        {
          createdAt: new Date(),
          name: '#tag-1',
        },
        new UniqueEntityID(),
      ),
    );

    const subscriber = new DeckCreatedSubscriber({
      deckTagRepository,
      logger,
      tagRepository,
      deckReadModelRepository,
    });

    await subscriber.insertDeckTags(new DeckCreatedDomainEvent(createDeckMock()));

    expect(tagRepository.insert).toHaveBeenCalledTimes(0);
    expect(deckTagRepository.insert).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledTimes(1);
  });
});
