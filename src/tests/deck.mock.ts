import { Deck, DeckProps } from '@core/decks/deck/deck.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

export const createDeckMock = (props: Partial<DeckProps> = {}) =>
  Deck.instanceExisting(
    {
      cards: [],
      createdAt: new Date(),
      deleted: false,
      published: false,
      description: '#description',
      name: '#name',
      ownerId: new UniqueEntityID(),
      tags: ['#tag'],
      imageUrl: '#image-url',
      ...props,
    },
    new UniqueEntityID(),
  );
