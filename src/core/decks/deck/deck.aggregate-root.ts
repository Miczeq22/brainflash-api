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
import { DeckCannotBeDeletedRule } from './rules/deck-cannot-be-deleted.rule';
import { DeckCannotBePublishedRule } from './rules/deck-cannot-be-published.rule';
import { DeckShouldBePublishedRule } from './rules/deck-should-be-published.rule';
import { AddedNewRatingToDeckEvent } from './events/added-new-rating-to-deck.domain-event';
import { DeckRating } from '../deck-rating/deck-rating.entity';
import { RatingRemovedFromDeckDomainEvent } from './events/rating-removed-from-deck.domain-event';
import {
  UserShouldAssessedDeckRule,
  DeckRateChecker,
} from './rules/user-should-assessed-deck.rule';
import { DeckPublishedDomainEvent } from './events/deck-published.domain-event';
import { DeckUnpublishedDomainEvent } from './events/deck-unpublished.domain-event';

export interface DeckProps {
  name: string;
  description: string;
  imageUrl?: string | null;
  tags: string[];
  ownerId: UniqueEntityID;
  createdAt: Date;
  cards: Card[];
  deleted: boolean;
  published: boolean;
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
      deleted: false,
      published: false,
    });

    deck.addDomainEvent(new DeckCreatedDomainEvent(deck));

    return deck;
  }

  public addCard(card: Card) {
    Deck.checkRule(new DeckCannotBeDeletedRule(this.props.deleted));
    Deck.checkRule(new CardWithSameQuestionCannotBeAddedTwiceRule(this.props.cards, card));

    this.props.cards = [...this.props.cards, card];

    this.addDomainEvent(new NewCardAddedDomainEvent(this.id, card));
  }

  public removeCard(cardId: UniqueEntityID) {
    Deck.checkRule(new DeckCannotBeDeletedRule(this.props.deleted));
    Deck.checkRule(new CardShouldExistInDeckRule(this.props.cards, cardId));

    this.props.cards = this.props.cards.filter((card) => !card.getId().equals(cardId));

    this.addDomainEvent(new CardRemovedFromDeckDomainEvent(cardId));
  }

  public delete() {
    Deck.checkRule(new DeckCannotBeDeletedRule(this.props.deleted));

    this.props.deleted = true;
  }

  public publish() {
    Deck.checkRule(new DeckCannotBeDeletedRule(this.props.deleted));
    Deck.checkRule(new DeckCannotBePublishedRule(this.props.published));

    this.props.published = true;

    this.addDomainEvent(new DeckPublishedDomainEvent(this));
  }

  public unpublish() {
    Deck.checkRule(new DeckCannotBeDeletedRule(this.props.deleted));
    Deck.checkRule(new DeckShouldBePublishedRule(this.props.published));

    this.props.published = false;

    this.addDomainEvent(new DeckUnpublishedDomainEvent(this));
  }

  public addRating(userId: UniqueEntityID, rating: number) {
    Deck.checkRule(new DeckCannotBeDeletedRule(this.props.deleted));

    this.addDomainEvent(
      new AddedNewRatingToDeckEvent(
        DeckRating.createNew({
          userId,
          rating,
          deckId: this.id,
        }),
      ),
    );
  }

  public async removeRating(userId: UniqueEntityID, deckRateChecker: DeckRateChecker) {
    Deck.checkRule(new DeckCannotBeDeletedRule(this.props.deleted));
    await Deck.checkRule(new UserShouldAssessedDeckRule(deckRateChecker, userId, this.id));

    this.addDomainEvent(new RatingRemovedFromDeckDomainEvent(this.id, userId));
  }

  public async updateName(name: string, uniqueDeckChecker: UniqueDeckChecker) {
    await Deck.checkRule(
      new UserDeckShouldHaveUniqueNameRule(uniqueDeckChecker, name, this.props.ownerId.getValue()),
    );

    this.props.name = name;
  }

  public updateDescription(description: string) {
    Deck.checkRule(new DeckCannotBeDeletedRule(this.props.deleted));

    this.props.description = description;
  }

  public updateTags(tags: string[]) {
    Deck.checkRule(new DeckCannotBeDeletedRule(this.props.deleted));
    Deck.checkRule(new DeckTagsCannotBeEmptyRule(tags));

    this.props.tags = tags;

    this.addDomainEvent(new DeckTagsUpdatedDomainEvent(this.id, tags));
  }

  public updateImageUrl(imageUrl: string) {
    this.props.imageUrl = imageUrl;
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

  public isDeleted() {
    return this.props.deleted;
  }

  public isPublished() {
    return this.props.published;
  }
}
