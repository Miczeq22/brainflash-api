import { Command } from '@app/processing/command';

interface Payload {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export const UPDATE_USER_PASSWORD = 'user-access/update-user-password';

export class UpdateUserPasswordCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(UPDATE_USER_PASSWORD, payload);
  }
}
