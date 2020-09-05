import { Tag } from './tag.entity';

export interface TagRepository {
  insert(tag: Tag): Promise<void>;

  findByName(name: string): Promise<Tag | null>;

  findById(id: string): Promise<Tag | null>;

  remove(id: string): Promise<void>;
}
