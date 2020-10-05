import { CommandHandler } from '@app/processing/command-handler';
import { UserRepository } from '@core/user-access/user/user.repository';
import { UnauthorizedError } from '@errors/unauthorized.error';
import { RefreshTokenCommand, REFRESH_TOKEN_COMMAND } from './refresh-token.command';
import jwt from 'jsonwebtoken';

interface Dependencies {
  userRepository: UserRepository;
}

interface AccessTokenPayload {
  userId: string;
}

export class RefreshTokenCommandHandler extends CommandHandler<RefreshTokenCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(REFRESH_TOKEN_COMMAND);
  }

  public async handle({ payload: { refreshToken } }: RefreshTokenCommand) {
    const { userRepository } = this.dependencies;

    const payload = jwt.decode(refreshToken) as AccessTokenPayload;

    if (!payload?.userId) {
      throw new UnauthorizedError();
    }

    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedError();
    }

    try {
      jwt.verify(refreshToken, `${process.env.JWT_TOKEN}${user.getPassword()}`);
    } catch {
      throw new UnauthorizedError();
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

    return accessToken;
  }
}
