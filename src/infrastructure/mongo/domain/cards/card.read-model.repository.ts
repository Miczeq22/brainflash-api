import { Card } from '@core/cards/card/card.aggregate-root';
import { MongoClient } from 'mongodb';
import { CardReadModelMapper, CardReadModelRepository } from './card.read-model';

interface Dependencies {
  mongoClient: MongoClient;
}

export class CardReadModelRepositoryImpl implements CardReadModelRepository {
  private collection = 'cards';

  constructor(private readonly dependencies: Dependencies) {}

  public async insert(card: Card) {
    const record = CardReadModelMapper.toPersistence(card);

    await this.dependencies.mongoClient.db().collection(this.collection).insertOne(record);
  }

  public async findAllForDeck(deckId: string) {
    const result = await this.dependencies.mongoClient
      .db()
      .collection(this.collection)
      .find({
        deckId,
      })
      .toArray();

    return result;
  }
}
