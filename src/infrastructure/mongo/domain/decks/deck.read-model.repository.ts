import { Deck } from '@core/decks/deck/deck.aggregate-root';
import { DeckReadModelRepository, DeckReadModelMapper, FindAllFilter } from './deck.read-model';
import { MongoClient } from 'mongodb';
import { UserRepository } from '@core/user-access/user/user.repository';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { USER_DECK_TABLE } from '@infrastructure/domain/decks/deck/deck.mapper';
import { DeckRatingRepository } from '@core/decks/deck-rating/deck-rating.repository';

interface Dependencies {
  mongoClient: MongoClient;
  userRepository: UserRepository;
  queryBuilder: QueryBuilder;
  deckRatingRepository: DeckRatingRepository;
}

export class DeckReadModelRepositoryImpl implements DeckReadModelRepository {
  private collection = 'decks';

  constructor(private readonly dependencies: Dependencies) {}

  public async insert(deck: Deck) {
    const user = await this.dependencies.userRepository.findById(deck.getOwnerId().getValue());

    const record = DeckReadModelMapper.toPersistence(deck, user.getUsername(), 0, 0, 0);

    await this.dependencies.mongoClient.db().collection(this.collection).insertOne(record);
  }

  public async update(deck: Deck) {
    const readModelDeck = await this.dependencies.mongoClient
      .db()
      .collection(this.collection)
      .findOne({
        id: deck.getId().getValue(),
      });

    if (!readModelDeck) {
      return;
    }

    const cardCount = await this.dependencies.mongoClient
      .db()
      .collection('cards')
      .find({
        deckId: deck.getId().getValue(),
      })
      .count(false);

    const deckRatings = await this.dependencies.deckRatingRepository.findByDeck(deck.getId());

    const rating =
      deckRatings.reduce((summary, currentRating) => summary + currentRating.getRating(), 0) /
      deckRatings.length;

    await this.dependencies.mongoClient
      .db()
      .collection(this.collection)
      .updateOne(
        {
          id: deck.getId().getValue(),
        },
        {
          $set: DeckReadModelMapper.toPersistence(
            deck,
            readModelDeck.ownerName,
            cardCount,
            rating,
            deckRatings.length,
          ),
        },
      );
  }

  public async findById(id: string) {
    const deck = await this.dependencies.mongoClient.db().collection(this.collection).findOne({
      id,
    });

    return deck ?? null;
  }

  public async findAll({ page, limit, userId }: FindAllFilter) {
    const enrolledDecks = (
      await this.dependencies.queryBuilder
        .select('deck_id')
        .where('user_id', userId)
        .from(USER_DECK_TABLE)
    ).map((deck) => deck.deck_id);

    const result = await this.dependencies.mongoClient
      .db()
      .collection(this.collection)
      .find({
        $or: [
          {
            published: true,
          },
          {
            ownerId: userId,
          },
          {
            id: { $in: enrolledDecks },
          },
        ],
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return result;
  }
}
