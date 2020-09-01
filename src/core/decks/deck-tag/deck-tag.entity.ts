import { Entity } from '@core/shared/entity';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

interface DeckTagProps {
  deckId: UniqueEntityID;
  tagId: UniqueEntityID;
}

export class DeckTag extends Entity<DeckTagProps> {
  private constructor(props: DeckTagProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew(deckId: UniqueEntityID, tagId: UniqueEntityID) {
    return new DeckTag(
      {
        deckId,
        tagId,
      },
      new UniqueEntityID(),
    );
  }

  public getDeckId() {
    return this.props.deckId;
  }

  public getTagId() {
    return this.props.tagId;
  }
}
