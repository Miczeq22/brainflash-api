import { Command } from '@app/processing/command';

interface Payload {
  token: string;
}

export const CONFIRM_ACCOUNT_COMMAND = 'user-access/confirm-account';

export class ConfirmAccountCommand extends Command<Payload> {
  constructor(token: string) {
    super(CONFIRM_ACCOUNT_COMMAND, { token });
  }
}
