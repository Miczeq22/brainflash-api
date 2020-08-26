import { Command } from './command';
import { CommandHandler } from './command-handler';
import { NotFoundError } from '@errors/not-found.error';

interface Dependencies {
  commandHandlers: CommandHandler<any>[];
}

export class CommandBus {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: Command<any>) {
    const { commandHandlers } = this.dependencies;

    const commandHandler = commandHandlers.find(
      (existingCommandHandler) => existingCommandHandler.type === command.type,
    );

    if (!commandHandler) {
      throw new NotFoundError(
        `Command handler for command of type: "${command.type}" does not exist.`,
      );
    }

    return commandHandler.handle(command);
  }
}
