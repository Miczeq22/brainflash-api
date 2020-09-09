import { createMockProxy } from '@tools/mock-proxy';
import { UserRepository } from '@core/user-access/user/user.repository';
import { LoginCommandHandler } from './login.command-handler';
import { LoginCommand } from './login.command';
import { User } from '@core/user-access/user/user.aggregate-root';
import { AccountStatus } from '@core/user-access/user-registration/account-status.value-object';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import bcrypt from 'bcrypt';

describe('[App] Login command handler', () => {
  const userRepository = createMockProxy<UserRepository>();

  beforeEach(() => {
    userRepository.mockClear();
  });

  test('should throw an error if user does not exist', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const handler = new LoginCommandHandler({
      userRepository,
    });

    await expect(() =>
      handler.handle(
        new LoginCommand({
          email: '#email',
          password: '#password',
        }),
      ),
    ).rejects.toThrowError('Unauthorized.');
  });

  test("should throw an error if password don't match", async () => {
    userRepository.findByEmail.mockResolvedValue(
      User.instanceExisting(
        {
          password: '#password',
          status: AccountStatus.Confirmed.getValue(),
          username: '#username',
        },
        new UniqueEntityID(),
      ),
    );

    const handler = new LoginCommandHandler({
      userRepository,
    });

    await expect(() =>
      handler.handle(
        new LoginCommand({
          email: '#email',
          password: '#invalid-password',
        }),
      ),
    ).rejects.toThrowError('Unauthorized.');
  });

  test('should throw an error if account is not confirmed', async () => {
    userRepository.findByEmail.mockResolvedValue(
      User.instanceExisting(
        {
          password: await bcrypt.hash('#password', 10),
          status: AccountStatus.WaitingForConfirmation.getValue(),
          username: '#username',
        },
        new UniqueEntityID(),
      ),
    );

    const handler = new LoginCommandHandler({
      userRepository,
    });

    await expect(() =>
      handler.handle(
        new LoginCommand({
          email: '#email',
          password: '#password',
        }),
      ),
    ).rejects.toThrowError('Account is not confirmed. Please check your email.');
  });

  test('should return proper tokens', async () => {
    process.env.JWT_TOKEN = 'secret';

    userRepository.findByEmail.mockResolvedValue(
      User.instanceExisting(
        {
          password: await bcrypt.hash('#password', 10),
          status: AccountStatus.Confirmed.getValue(),
          username: '#username',
        },
        new UniqueEntityID(),
      ),
    );

    const handler = new LoginCommandHandler({
      userRepository,
    });

    const result = await handler.handle(
      new LoginCommand({
        email: '#email',
        password: '#password',
      }),
    );

    expect(Object.keys(result)).toEqual(['accessToken', 'refreshToken']);
  });
});
