import { createMockProxy } from '@tools/mock-proxy';
import { UniqueEmailChecker } from './rules/user-should-have-unique-email.rule';
import { UserRegistration } from './user-registration.aggregate-root';
import { AccountStatus } from './account-status.value-object';
import { UserRegisteredDomainEvent } from './events/user-registered.domain-event';

describe('[Domain] User Registration', () => {
  const emailChecker = createMockProxy<UniqueEmailChecker>();

  beforeEach(() => {
    emailChecker.mockClear();
  });

  test('should throw an error if email is already taken', async () => {
    emailChecker.isUnique.mockResolvedValue(false);

    const email = '#email';

    expect(() =>
      UserRegistration.registerNew(
        {
          email,
          password: '#password',
          username: '#username',
        },
        emailChecker,
      ),
    ).rejects.toThrowError(`Email address: "${email}" is already taken.`);
  });

  test('should register new account and add proper data', async () => {
    emailChecker.isUnique.mockResolvedValue(true);

    const userRegistration = await UserRegistration.registerNew(
      {
        email: '#email',
        password: '#password',
        username: '#username',
      },
      emailChecker,
    );

    expect(userRegistration.getConfirmationDate()).toEqual(null);
    expect(userRegistration.getStatus()).toEqual(AccountStatus.WaitingForConfirmation.getValue());
    expect(userRegistration.getDomainEvents()[0] instanceof UserRegisteredDomainEvent).toBeTruthy();
  });
});
