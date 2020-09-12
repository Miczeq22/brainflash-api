import { CommandHandler } from '@app/processing/command-handler';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { InvariantError } from '@errors/invariant.error';
import { NotFoundError } from '@errors/not-found.error';
import { EnrollDeckCommand, ENROLL_DECK_COMMAND } from './enroll-deck.command';

interface Dependencies {
  deckRepository: DeckRepository;
}

export class EnrollDeckCommandHandler extends CommandHandler<EnrollDeckCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(ENROLL_DECK_COMMAND);
  }

  public async handle({ payload: { deckId, userId } }: EnrollDeckCommand) {
    const { deckRepository } = this.dependencies;

    const deck = await deckRepository.findById(deckId);

    if (!deck) {
      throw new NotFoundError('Deck does not exist.');
    }

    const isUserAlreadyEnrolled = await deckRepository.isUserEnrolled(userId, deckId);

    if (isUserAlreadyEnrolled) {
      throw new InvariantError('You already enrolled to this deck.');
    }

    await deckRepository.enrollUser(userId, deckId);
  }
}
