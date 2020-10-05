import { Command } from '@app/processing/command';

interface Payload {
  refreshToken: string;
}

export const REFRESH_TOKEN_COMMAND = 'user-access/refresh-token';

export class RefreshTokenCommand extends Command<Payload> {
  constructor(refreshToken: string) {
    super(REFRESH_TOKEN_COMMAND, { refreshToken });
  }
}
