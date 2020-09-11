import { QueryHandler } from '@app/processing/query-handler';
import { GetDeckByIdQuery, GET_DECK_BY_ID_QUERY } from './get-deck-by-id.query';
import {
  DeckReadModel,
  DeckReadModelRepository,
} from '@infrastructure/mongo/domain/decks/deck.read-model';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { NotFoundError } from '@errors/not-found.error';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { UnauthenticatedError } from '@errors/unauthenticated.error';

interface Dependencies {
  deckRepository: DeckRepository;
  deckReadModelRepository: DeckReadModelRepository;
}

export class GetDeckByIdQueryHandler extends QueryHandler<GetDeckByIdQuery, DeckReadModel> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_DECK_BY_ID_QUERY);
  }

  public async handle({ payload: { userId, deckId } }: GetDeckByIdQuery) {
    const { deckRepository, deckReadModelRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    if (!deck.isPublished() && !deck.getOwnerId().equals(new UniqueEntityID(userId))) {
      throw new UnauthenticatedError('Only deck owner can see unpublised deck.');
    }

    const deckReadModel = await deckReadModelRepository.findById(deckId);

    if (!deckReadModel) {
      throw new NotFoundError('Deck read model does not exist.');
    }

    return deckReadModel;
  }
}
