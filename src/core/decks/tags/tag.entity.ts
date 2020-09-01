import { Entity } from '@core/shared/entity';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

interface TagProps {
  createdAt: Date;
  name: string;
}

export class Tag extends Entity<TagProps> {
  private constructor(props: TagProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew(name: string) {
    return new Tag({
      name,
      createdAt: new Date(),
    });
  }

  public static instanceExisting(props: TagProps, id: UniqueEntityID) {
    return new Tag(props, id);
  }

  public getName() {
    return this.props.name;
  }

  public getCreatedAt() {
    return this.props.createdAt;
  }
}
