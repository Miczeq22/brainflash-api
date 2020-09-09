import { User } from './user.aggregate-root';
import { AccountStatus } from '../user-registration/account-status.value-object';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import bcrypt from 'bcrypt';

describe('[Domain] User', () => {
  test('should thrown an error if old password is invalid', async () => {
    const user = User.instanceExisting(
      {
        password: '#password',
        status: AccountStatus.Confirmed.getValue(),
        username: '#username',
      },
      new UniqueEntityID(),
    );

    await expect(() =>
      user.updatePassword('#invalid-password', '#new-password'),
    ).rejects.toThrowError('Old password is invalid.');
  });

  test('should update password', async () => {
    const password = await bcrypt.hash('#password', 10);

    const user = User.instanceExisting(
      {
        password,
        status: AccountStatus.Confirmed.getValue(),
        username: '#username',
      },
      new UniqueEntityID(),
    );

    const oldPasswordHash = user.getPassword();

    await user.updatePassword('#password', '#new-password');

    expect(oldPasswordHash === user.getPassword()).toBeFalsy();
  });
});
