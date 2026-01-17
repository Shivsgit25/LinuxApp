import { CommandParser } from './parser';
import { CommandRouter } from './router';
import { CommandResult } from './types';

export class CommandExecutor {
  private parser: CommandParser;
  private router: CommandRouter;
  private history: string[] = [];

  constructor() {
    this.parser = new CommandParser();
    this.router = new CommandRouter();
  }

  getRouter(): CommandRouter {
    return this.router;
  }

  async execute(input: string): Promise<CommandResult> {
    if (input.trim()) {
      this.history.push(input);
    }

    const parsedCommand = this.parser.parse(input);
    return await this.router.route(parsedCommand);
  }

  getHistory(): string[] {
    return [...this.history];
  }

  autocomplete(input: string): string[] {
    const commands = this.router.getCommandNames();
    return this.parser.autocomplete(input, commands);
  }

  clearHistory(): void {
    this.history = [];
  }
}