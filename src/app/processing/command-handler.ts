import { Command } from './command';

export abstract class CommandHandler<C extends Command<any>> {
  constructor(public readonly type: string) {}

  public abstract handle(command: C): Promise<any>;
}
