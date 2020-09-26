import { CommandHandler } from '@app/processing/command-handler';
import { LoginCommand, LOGIN_COMMAND } from './login.command';
import { UserRepository } from '@core/user-access/user/user.repository';
import bcrypt from 'bcrypt';
import { UnauthorizedError } from '@errors/unauthorized.error';
import { AccountStatus } from '@core/user-access/user-registration/account-status.value-object';
import { BusinessRuleValidationError } from '@errors/business-rule-validation.error';
import jwt from 'jsonwebtoken';

interface Dependencies {
  userRepository: UserRepository;
}

export class LoginCommandHandler extends CommandHandler<LoginCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(LOGIN_COMMAND);
  }

  public async handle({ payload: { email, password } }: LoginCommand) {
    const { userRepository } = this.dependencies;

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError();
    }

    const isValidPassword = await bcrypt.compare(password, user.getPassword());

    if (!isValidPassword) {
      throw new UnauthorizedError();
    }

    if (user.getStatus() !== AccountStatus.Confirmed.getValue()) {
      throw new BusinessRuleValidationError('Account is not confirmed. Please check your email.');
    }

    const accessToken = jwt.sign(
      {
        userId: user.getId().getValue(),
        username: user.getUsername(),
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: process.env.NODE_ENV === 'development' ? '1h' : '60s',
      },
    );

    const refreshToken = jwt.sign(
      {
        userId: user.getId().getValue(),
        username: user.getUsername(),
      },
      `${process.env.JWT_TOKEN}${user.getPassword()}`,
      {
        expiresIn: '24h',
      },
    );

    return { accessToken, refreshToken };
  }
}
