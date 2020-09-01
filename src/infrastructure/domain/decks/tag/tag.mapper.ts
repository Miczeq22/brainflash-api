import { Tag } from '@core/decks/tags/tag.entity';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

interface TagRecord {
  id: string;
  name: string;
  created_at: string;
}

export const TAG_TABLE = 'public.tag';

export class TagMapper {
  public static toPersistence(tag: Tag): TagRecord {
    return {
      id: tag.getId().getValue(),
      name: tag.getName(),
      created_at: tag.getCreatedAt().toISOString(),
    };
  }

  public static toEntity({ created_at, id, ...data }: TagRecord): Tag {
    return Tag.instanceExisting(
      {
        ...data,
        createdAt: new Date(created_at),
      },
      new UniqueEntityID(id),
    );
  }
}
