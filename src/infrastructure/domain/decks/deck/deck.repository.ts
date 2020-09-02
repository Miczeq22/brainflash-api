import { DeckRepository } from '@core/decks/decks/deck.repository';
import { Deck } from '@core/decks/decks/deck.aggregate-root';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { DeckMapper, DECK_TABLE } from './deck.mapper';
import { DeckTagRepository } from '@core/decks/deck-tag/deck-tag.repository';
import { TagRepository } from '@core/decks/tags/tag.repository';

interface Dependencies {
  queryBuilder: QueryBuilder;
  deckTagRepository: DeckTagRepository;
  tagRepository: TagRepository;
}

export class DeckRepositoryImpl implements DeckRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async insert(deck: Deck) {
    const record = DeckMapper.toPersistence(deck);

    await this.dependencies.queryBuilder.insert(record).into(DECK_TABLE);
  }

  public async update(deck: Deck) {
    const { id, ...data } = DeckMapper.toPersistence(deck);

    await this.dependencies.queryBuilder.update(data).where('id', id).into(DECK_TABLE);
  }

  public async findById(id: string) {
    const result = await this.dependencies.queryBuilder.where('id', id).from(DECK_TABLE);

    if (!result.length) {
      return null;
    }

    const deckTags = await this.dependencies.deckTagRepository.findAllByDeck(id);

    const tagsPromise = deckTags.map((deckTag) =>
      this.dependencies.tagRepository.findById(deckTag.getTagId().getValue()),
    );

    const tags = await Promise.all(tagsPromise);

    return DeckMapper.toEntity(
      result[0],
      [],
      tags.map((tag) => tag.getName()),
    );
  }
}
