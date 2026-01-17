import { CommandLexer } from './lexer';
import { ParsedCommand } from './types';

export class CommandParser {
  parse(input: string): ParsedCommand {
    const lexer = new CommandLexer(input);
    const tokens = lexer.tokenize();
    
    if (tokens.length === 0) {
      return { command: '', args: [], flags: {} };
    }

    const command = tokens[0];
    const args: string[] = [];
    const flags: Record<string, string | boolean> = {};

    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token.startsWith('-')) {
        const flagName = token.replace(/^-+/, '');
        
        // Check if next token is a value for this flag
        if (i + 1 < tokens.length && !tokens[i + 1].startsWith('-')) {
          flags[flagName] = tokens[i + 1];
          i++; // Skip the value token
        } else {
          flags[flagName] = true;
        }
      } else {
        args.push(token);
      }
    }

    return { command, args, flags };
  }

  autocomplete(input: string, availableCommands: string[]): string[] {
    const tokens = input.trim().split(/\s+/);
    const lastToken = tokens[tokens.length - 1] || '';
    
    if (tokens.length <= 1) {
      return availableCommands.filter(cmd => 
        cmd.toLowerCase().startsWith(lastToken.toLowerCase())
      );
    }
    
    return [];
  }
}