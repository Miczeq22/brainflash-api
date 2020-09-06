import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { AggregateRoot } from '@core/shared/aggregate-root';
import {
  UserDeckShouldHaveUniqueNameRule,
  UniqueDeckChecker,
} from './rules/user-deck-should-have-unique-name.rule';
import { DeckTagsCannotBeEmptyRule } from './rules/deck-tags-cannot-be-empty.rule';
import { DeckCreatedDomainEvent } from './events/deck-created.domain-event';
import { DeckTagsUpdatedDomainEvent } from './events/deck-tags-updated.domain-event';
import { Card } from '../card/card.entity';
import { CardWithSameQuestionCannotBeAddedTwiceRule } from './rules/card-with-same-question-cannot-be-added-twice.rule';
import { NewCardAddedDomainEvent } from './events/new-card-added.domain-event';
import { CardShouldExistInDeckRule } from './rules/card-should-exist-in-deck.rule';
import { CardRemovedFromDeckDomainEvent } from './events/card-removed-from-deck.domain-event';

interface DeckProps {
  name: string;
  description: string;
  imageUrl?: string | null;
  tags: string[];
  ownerId: UniqueEntityID;
  createdAt: Date;
  cards: Card[];
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
      cards: [],
      createdAt: new Date(),
    });

    deck.addDomainEvent(new DeckCreatedDomainEvent(tags, deck.getId()));

    return deck;
  }

  public addCard(card: Card) {
    Deck.checkRule(new CardWithSameQuestionCannotBeAddedTwiceRule(this.props.cards, card));

    this.props.cards = [...this.props.cards, card];

    this.addDomainEvent(new NewCardAddedDomainEvent(this.id, card));
  }

  public removeCard(cardId: UniqueEntityID) {
    Deck.checkRule(new CardShouldExistInDeckRule(this.props.cards, cardId));

    this.props.cards = this.props.cards.filter((card) => !card.getId().equals(cardId));

    this.addDomainEvent(new CardRemovedFromDeckDomainEvent(cardId));
  }

  public async updateName(name: string, uniqueDeckChecker: UniqueDeckChecker) {
    await Deck.checkRule(
      new UserDeckShouldHaveUniqueNameRule(uniqueDeckChecker, name, this.props.ownerId.getValue()),
    );

    this.props.name = name;
  }

  public updateDescription(description: string) {
    this.props.description = description;
  }

  public updateTags(tags: string[]) {
    Deck.checkRule(new DeckTagsCannotBeEmptyRule(tags));
    this.props.tags = tags;

    this.addDomainEvent(new DeckTagsUpdatedDomainEvent(this.id, tags));
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

  public getTags() {
    return this.props.tags;
  }
}
