import { QueryHandler } from '@app/processing/query-handler';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import {
  DeckReadModel,
  DeckReadModelRepository,
} from '@infrastructure/mongo/domain/decks/deck.read-model';
import { GetAllDecksQuery, GET_ALL_DECKS_QUERY } from './get-all-decks.query';

interface Dependencies {
  deckReadModelRepository: DeckReadModelRepository;
}

export class GetAllDecksQueryHandler extends QueryHandler<GetAllDecksQuery, DeckReadModel[]> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_ALL_DECKS_QUERY);
  }

  public async handle({ payload: { userId, page = 1, limit = 10 } }: GetAllDecksQuery) {
    const { deckReadModelRepository } = this.dependencies;

    const decks = await deckReadModelRepository.findAll({
      userId,
      page,
      limit,
    });

    return decks.map((deck) => ({
      ...deck,
      isDeckOwner: new UniqueEntityID(deck.ownerId).equals(new UniqueEntityID(userId)),
      thumbnailUrl: deck.imageUrl
        ? `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${
            deck.imageUrl.split('.')[0]
          }-thumbnail.${deck.imageUrl.split('.').pop()}`
        : undefined,
      imageUrl: deck.imageUrl
        ? `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${deck.imageUrl}`
        : undefined,
    }));
  }
}
