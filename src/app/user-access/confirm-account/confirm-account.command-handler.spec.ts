import { createMockProxy } from '@tools/mock-proxy';
import { UserRegistrationRepository } from '@core/user-access/user-registration/user-registration.repository';
import jwt from 'jsonwebtoken';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { ConfirmAccountCommandHandler } from './confirm-account.command-handler';
import { ConfirmAccountCommand } from './confirm-account.command';
import { UserRegistration } from '@core/user-access/user-registration/user-registration.aggregate-root';
import { AccountStatus } from '@core/user-access/user-registration/account-status.value-object';

describe('[App] Confirm account command handler', () => {
  const userRegistrationRepository = createMockProxy<UserRegistrationRepository>();

  beforeEach(() => {
    userRegistrationRepository.mockClear();
  });

  test('should throw an error if token secret is invalid', async () => {
    process.env.VERIFICATION_TOKEN_SECRET = 'secret';

    const token = jwt.sign(
      {
        userId: new UniqueEntityID().getValue(),
      },
      'invalid-secret',
    );

    const handler = new ConfirmAccountCommandHandler({
      userRegistrationRepository,
    });

    await expect(() => handler.handle(new ConfirmAccountCommand(token))).rejects.toThrowError(
      'Validation token is invalid.',
    );
  });

  test('should throw an error if user does not exist', async () => {
    process.env.VERIFICATION_TOKEN_SECRET = 'secret';
    userRegistrationRepository.findById.mockResolvedValue(null);

    const token = jwt.sign(
      {
        userId: new UniqueEntityID().getValue(),
      },
      'secret',
    );

    const handler = new ConfirmAccountCommandHandler({
      userRegistrationRepository,
    });

    await expect(() => handler.handle(new ConfirmAccountCommand(token))).rejects.toThrowError(
      'User does not exist.',
    );
  });

  test('should confirm account and update it in database', async () => {
    process.env.VERIFICATION_TOKEN_SECRET = 'secret';
    userRegistrationRepository.findById.mockResolvedValue(
      UserRegistration.instanceExisting(
        {
          accountStatus: AccountStatus.WaitingForConfirmation.getValue(),
          confirmationDate: null,
          email: '#email',
          password: '#password',
          registrationDate: new Date(),
          username: '#username',
        },
        new UniqueEntityID(),
      ),
    );

    const token = jwt.sign(
      {
        userId: new UniqueEntityID().getValue(),
      },
      'secret',
    );

    const handler = new ConfirmAccountCommandHandler({
      userRegistrationRepository,
    });

    await handler.handle(new ConfirmAccountCommand(token));

    const updatePayload = userRegistrationRepository.update.mock.calls[0][0];

    expect(updatePayload.getStatus()).toEqual(AccountStatus.Confirmed.getValue());
    expect(userRegistrationRepository.update).toHaveBeenCalledTimes(1);
  });
});
