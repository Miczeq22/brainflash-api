import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { AggregateRoot } from '@core/shared/aggregate-root';
import { DeckCreatedDomainEvent } from './events/deck-created.domain-event';
import {
  UserDeckShouldHaveUniqueNameRule,
  UniqueDeckChecker,
} from './rules/user-deck-should-have-unique-name.rule';
import { DeckTagsCannotBeEmptyRule } from './rules/deck-tags-cannot-be-empty.rule';

interface DeckProps {
  name: string;
  description: string;
  imageUrl?: string | null;
  tags: string[];
  ownerId: UniqueEntityID;
  createdAt: Date;
  cardIDs: UniqueEntityID[];
}

interface NewDeckProps {
  name: string;
  description: string;
  ownerId: UniqueEntityID;
  tags: string[];
  imageUrl?: string;
}

export class Deck extends AggregateRoot<DeckProps> {
  private constructor(props: DeckProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static async createNew(
    { name, description, imageUrl = null, tags, ownerId }: NewDeckProps,
    uniqueDeckChecker: UniqueDeckChecker,
  ) {
    await Deck.checkRule(
      new UserDeckShouldHaveUniqueNameRule(uniqueDeckChecker, name, ownerId.getValue()),
    );

    await Deck.checkRule(new DeckTagsCannotBeEmptyRule(tags));

    const deck = new Deck({
      name,
      description,
      tags,
      imageUrl,
      ownerId,
      cardIDs: [],
      createdAt: new Date(),
    });

    deck.addDomainEvent(new DeckCreatedDomainEvent(tags, deck.getId()));

    return deck;
  }

  public static instanceExisting(props: DeckProps, id: UniqueEntityID) {
    return new Deck(props, id);
  }

  public getName() {
    return this.props.name;
  }

  public getDescription() {
    return this.props.description;
  }

  public getImageUrl() {
    return this.props.imageUrl;
  }

  public getOwnerId() {
    return this.props.ownerId;
  }

  public getCreatedAt() {
    return this.props.createdAt;
  }
}
