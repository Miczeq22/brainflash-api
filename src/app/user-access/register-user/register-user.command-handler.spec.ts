import { createMockProxy } from '@tools/mock-proxy';
import { UniqueEmailChecker } from '@core/user-access/user-registration/rules/user-should-have-unique-email.rule';
import { UserRegistrationRepository } from '@core/user-access/user-registration/user-registration.repository';
import { RegisterUserCommandHandler } from './register-user.command-handler';
import { RegisterUserCommand } from './register-user.command';

describe('[App] Register user command', () => {
  const emailChecker = createMockProxy<UniqueEmailChecker>();
  const userRegistrationRepository = createMockProxy<UserRegistrationRepository>();

  beforeEach(() => {
    emailChecker.mockClear();
    userRegistrationRepository.mockClear();
  });

  test('should insert user registration into database', async () => {
    emailChecker.isUnique.mockResolvedValue(true);

    const handler = new RegisterUserCommandHandler({
      userRegistrationRepository,
      uniqueEmailChecker: emailChecker,
    });

    await handler.handle(
      new RegisterUserCommand({
        email: '#email',
        password: '#password',
        username: '#username',
      }),
    );

    expect(userRegistrationRepository.insert).toHaveBeenCalledTimes(1);
  });
});
