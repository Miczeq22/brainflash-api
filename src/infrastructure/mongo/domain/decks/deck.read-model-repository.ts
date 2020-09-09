import { Deck } from '@core/decks/deck/deck.aggregate-root';
import { DeckReadModelRepository, DeckReadModelMapper } from './deck.read-model';
import { MongoClient } from 'mongodb';
import { UserRepository } from '@core/user-access/user/user.repository';

interface Dependencies {
  mongoClient: MongoClient;
  userRepository: UserRepository;
}

export class DeckReadModelRepositoryImpl implements DeckReadModelRepository {
  private collection = 'decks';

  constructor(private readonly dependencies: Dependencies) {}

  public async insert(deck: Deck) {
    const user = await this.dependencies.userRepository.findById(deck.getOwnerId().getValue());

    const record = DeckReadModelMapper.toPersistence(deck, user.getUsername(), 0);

    await this.dependencies.mongoClient.db().collection(this.collection).insertOne(record);
  }
}
