import { CommandHandler } from '@app/processing/command-handler';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { NotFoundError } from '@errors/not-found.error';
import { UnauthenticatedError } from '@errors/unauthenticated.error';
import { DeckReadModelRepository } from '@infrastructure/mongo/domain/decks/deck.read-model';
import { DeleteImageCommand, DELETE_IMAGE_COMMAND_TYPE } from './delete-image.command';
import AWS from 'aws-sdk';

interface Dependencies {
  deckRepository: DeckRepository;
  deckReadModelRepository: DeckReadModelRepository;
}

export class DeleteImageCommandHandler extends CommandHandler<DeleteImageCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(DELETE_IMAGE_COMMAND_TYPE);
  }

  public async handle({ payload: { deckId, userId } }: DeleteImageCommand) {
    const { deckReadModelRepository, deckRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    if (!deck.getOwnerId().equals(new UniqueEntityID(userId))) {
      throw new UnauthenticatedError('Only deck owner can delete its image.');
    }

    if (!deck.getImageUrl()) {
      return;
    }

    // TODO: Add S3 Service as Storage abstraction and pass it as DI
    const s3 = new AWS.S3({
      secretAccessKey: process.env.S3_SECRET_KEY,
      accessKeyId: process.env.S3_ACCESS_KEY,
      endpoint: process.env.S3_ENDPOINT,
      s3ForcePathStyle: true,
      apiVersion: 'v4',
    });

    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: deck.getImageUrl(),
      })
      .promise();

    deck.updateImageUrl(null);

    await deckRepository.update(deck);

    // TODO: Probably this should come from subscriber
    await deckReadModelRepository.update(deck);
  }
}
