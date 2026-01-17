import { Command, ParsedCommand, CommandResult } from './types';

export class CommandRouter {
  private commands: Map<string, Command> = new Map();
  private aliases: Map<string, string> = new Map();

  register(command: Command): void {
    this.commands.set(command.name, command);
  }

  registerAlias(alias: string, commandName: string): void {
    this.aliases.set(alias, commandName);
  }

  unregisterAlias(alias: string): void {
    this.aliases.delete(alias);
  }

  getCommand(name: string): Command | undefined {
    const actualName = this.aliases.get(name) || name;
    return this.commands.get(actualName);
  }

  getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  getCommandNames(): string[] {
    const commands = Array.from(this.commands.keys());
    const aliases = Array.from(this.aliases.keys());
    return [...commands, ...aliases].sort();
  }

  async route(parsedCommand: ParsedCommand): Promise<CommandResult> {
    const { command, args } = parsedCommand;
    
    if (!command) {
      return { output: '' };
    }

    const cmd = this.getCommand(command);
    
    if (!cmd) {
      return { 
        output: '', 
        error: `Command not found: ${command}. Type 'help' for available commands.` 
      };
    }

    try {
      const output = await cmd.execute(args);
      return { output };
    } catch (error) {
      return { 
        output: '', 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}