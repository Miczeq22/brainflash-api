import { createMockProxy } from '@tools/mock-proxy';
import { UserRepository } from '@core/user-access/user/user.repository';
import { UpdateUserPasswordCommandHandler } from './update-user-password.command-handler';
import { UpdateUserPasswordCommand } from './update-user-password.command';
import { User } from '@core/user-access/user/user.aggregate-root';
import bcrypt from 'bcrypt';
import { AccountStatus } from '@core/user-access/user-registration/account-status.value-object';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

describe('[App] Update user password command handler', () => {
  const userRepository = createMockProxy<UserRepository>();

  beforeEach(() => {
    userRepository.mockClear();
  });

  test('should thrown an error if user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    const handler = new UpdateUserPasswordCommandHandler({
      userRepository,
    });

    await expect(() =>
      handler.handle(
        new UpdateUserPasswordCommand({
          newPassword: '#new-password',
          oldPassword: '#old-password',
          userId: '#user-id',
        }),
      ),
    ).rejects.toThrowError('Unauthorized.');
  });

  test('should update password and save it to database', async () => {
    userRepository.findById.mockResolvedValue(
      User.instanceExisting(
        {
          password: await bcrypt.hash('#password', 10),
          status: AccountStatus.Confirmed.getValue(),
          username: '#username',
        },
        new UniqueEntityID(),
      ),
    );

    const handler = new UpdateUserPasswordCommandHandler({
      userRepository,
    });

    await handler.handle(
      new UpdateUserPasswordCommand({
        newPassword: '#new-password',
        oldPassword: '#password',
        userId: '#user-id',
      }),
    );

    const updatePayload = userRepository.update.mock.calls[0][0];

    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(await bcrypt.compare('#new-password', updatePayload.getPassword())).toBeTruthy();
  });
});
