/* eslint-disable no-await-in-loop */
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { Deck } from '@core/decks/deck/deck.aggregate-root';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { DeckMapper, DECK_TABLE } from './deck.mapper';
import { DeckTagRepository } from '@core/decks/deck-tag/deck-tag.repository';
import { TagRepository } from '@core/decks/tags/tag.repository';
import { TAG_TABLE, TagMapper } from '../tag/tag.mapper';
import { DECK_TAG_TABLE, DeckTagMapper } from '../deck-tag/deck-tag.mapper';
import { Tag } from '@core/decks/tags/tag.entity';
import { DeckTag } from '@core/decks/deck-tag/deck-tag.entity';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { CARD_TABLE } from '@infrastructure/domain/cards/card/card.mapper';
import { CardMapper } from '../card/card.mapper';

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

    const cards = await this.dependencies.queryBuilder
      .select(['id', 'question', 'answer'])
      .where('deck_id', id)
      .from(CARD_TABLE);

    return DeckMapper.toEntity(
      result[0],
      cards.map((card) => CardMapper.toEntity(card)),
      tags.map((tag) => tag.getName()),
    );
  }

  public async removeTags(deckId: UniqueEntityID, tags: string[]) {
    const tagIDs = (
      await Promise.all(
        tags.map((tag) => this.dependencies.queryBuilder.where('name', tag).from(TAG_TABLE)),
      )
    ).map((tagResult) => tagResult[0].id);

    await Promise.all(
      tagIDs.map((tagId) =>
        this.dependencies.queryBuilder
          .where('tag_id', tagId)
          .andWhere('deck_id', deckId.getValue())
          .delete()
          .from(DECK_TAG_TABLE),
      ),
    );
  }

  public async addTags(deckId: UniqueEntityID, tags: string[]) {
    const tagsToInsert = tags.map((tag) => Tag.createNew(tag));

    for (const tagToInsert of tagsToInsert) {
      const existingTag = await this.dependencies.queryBuilder
        .where('name', tagToInsert.getName())
        .from(TAG_TABLE);

      if (!existingTag.length) {
        await this.dependencies.queryBuilder
          .insert(TagMapper.toPersistence(tagToInsert))
          .into(TAG_TABLE);
      }

      await this.dependencies.queryBuilder
        .insert(DeckTagMapper.toPersistence(DeckTag.createNew(deckId, tagToInsert.getId())))
        .into(DECK_TAG_TABLE);
    }
  }
}
