import { Deck } from '@core/decks/deck/deck.aggregate-root';
import { DeckReadModelRepository, DeckReadModelMapper, FindAllFilter } from './deck.read-model';
import { MongoClient } from 'mongodb';
import { UserRepository } from '@core/user-access/user/user.repository';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { USER_DECK_TABLE } from '@infrastructure/domain/decks/deck/deck.mapper';

interface Dependencies {
  mongoClient: MongoClient;
  userRepository: UserRepository;
  queryBuilder: QueryBuilder;
}

export class DeckReadModelRepositoryImpl implements DeckReadModelRepository {
  private collection = 'decks';

  constructor(private readonly dependencies: Dependencies) {}

  public async insert(deck: Deck) {
    const user = await this.dependencies.userRepository.findById(deck.getOwnerId().getValue());

    const record = DeckReadModelMapper.toPersistence(deck, user.getUsername(), 0);

    await this.dependencies.mongoClient.db().collection(this.collection).insertOne(record);
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
