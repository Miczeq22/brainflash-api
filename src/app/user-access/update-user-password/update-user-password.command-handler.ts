import { CommandHandler } from '@app/processing/command-handler';
import { UpdateUserPasswordCommand, UPDATE_USER_PASSWORD } from './update-user-password.command';
import { UserRepository } from '@core/user-access/user/user.repository';
import { UnauthorizedError } from '@errors/unauthorized.error';

interface Dependencies {
  userRepository: UserRepository;
}

export class UpdateUserPasswordCommandHandler extends CommandHandler<UpdateUserPasswordCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(UPDATE_USER_PASSWORD);
  }

  public async handle({
    payload: { newPassword, oldPassword, userId },
  }: UpdateUserPasswordCommand) {
    const { userRepository } = this.dependencies;

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError();
    }

    await user.updatePassword(oldPassword, newPassword);

    await userRepository.update(user);
  }
}
