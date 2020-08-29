import { CommandHandler } from '@app/processing/command-handler';
import { ConfirmAccountCommand, CONFIRM_ACCOUNT_COMMAND } from './confirm-account.command';
import { UserRegistrationRepository } from '@core/user-access/user-registration/user-registration.repository';
import { NotFoundError } from '@errors/not-found.error';
import { BusinessRuleValidationError } from '@errors/business-rule-validation.error';
import jwt from 'jsonwebtoken';

interface Dependencies {
  userRegistrationRepository: UserRegistrationRepository;
}

export class ConfirmAccountCommandHandler extends CommandHandler<ConfirmAccountCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(CONFIRM_ACCOUNT_COMMAND);
  }

  public async handle({ payload: { token } }: ConfirmAccountCommand) {
    const { userRegistrationRepository } = this.dependencies;

    let payload: { userId: string };

    try {
      payload = jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET) as { userId: string };
    } catch (error) {
      throw new BusinessRuleValidationError('Validation token is invalid.');
    }

    const userRegistration = await userRegistrationRepository.findById(payload.userId);

    if (!userRegistration) {
      throw new NotFoundError('User does not exist.');
    }

    userRegistration.confirmAccount();

    await userRegistrationRepository.update(userRegistration);
  }
}
