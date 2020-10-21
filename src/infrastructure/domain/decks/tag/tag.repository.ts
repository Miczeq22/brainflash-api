import { TagRepository } from '@core/decks/tags/tag.repository';
import { Tag } from '@core/decks/tags/tag.entity';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { TagMapper, TAG_TABLE } from './tag.mapper';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class TagRepositoryImpl implements TagRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async insert(tag: Tag) {
    const record = TagMapper.toPersistence(tag);

    await this.dependencies.queryBuilder.insert(record).into(TAG_TABLE);
  }

  public async findById(id: string) {
    const result = await this.dependencies.queryBuilder.where('id', id).from(TAG_TABLE);

    return result.length ? TagMapper.toEntity(result[0]) : null;
  }

  public async findByName(name: string) {
    const result = await this.dependencies.queryBuilder.where('name', name).from(TAG_TABLE);

    return result.length ? TagMapper.toEntity(result[0]) : null;
  }

  public async findAll() {
    const result = await this.dependencies.queryBuilder.from(TAG_TABLE);

    return result.map(TagMapper.toEntity);
  }

  public async remove(id: string) {
    await this.dependencies.queryBuilder.where('id', id).delete().from(TAG_TABLE);
  }
}
