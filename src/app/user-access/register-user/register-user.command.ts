import { Command } from '@app/processing/command';

interface Payload {
  email: string;
  password: string;
  username: string;
}

export const REGISTER_USER_COMMAND = 'user-registration/register';

export class RegisterUserCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(REGISTER_USER_COMMAND, payload);
  }
}
