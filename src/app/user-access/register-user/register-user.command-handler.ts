import { CommandHandler } from '@app/processing/command-handler';
import { RegisterUserCommand, REGISTER_USER_COMMAND } from './register-user.command';
import { UserRegistrationRepository } from '@core/user-access/user-registration/user-registration.repository';
import { UserRegistration } from '@core/user-access/user-registration/user-registration.aggregate-root';
import { UniqueEmailChecker } from '@core/user-access/user-registration/rules/user-should-have-unique-email.rule';
import { DomainEvents } from '@core/shared/domain-events';

interface Dependencies {
  userRegistrationRepository: UserRegistrationRepository;
  emailChecker: UniqueEmailChecker;
}

export class RegisterUserCommandHandler extends CommandHandler<RegisterUserCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(REGISTER_USER_COMMAND);
  }

  public async handle({ payload }: RegisterUserCommand) {
    const { userRegistrationRepository, emailChecker } = this.dependencies;

    const userRegistration = await UserRegistration.registerNew(payload, emailChecker);

    await userRegistrationRepository.insert(userRegistration);

    await DomainEvents.dispatchDomainEventsForAggregate(userRegistration.getId());
  }
}
