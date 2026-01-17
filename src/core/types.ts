export interface Command {
  name: string;
  description: string;
  flags?: string[];
  execute(args: string[]): Promise<string>;
}

export interface ParsedCommand {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export interface TerminalState {
  history: string[];
  currentInput: string;
  cursorPosition: number;
}

export interface Permission {
  name: string;
  description: string;
  required: boolean;
}

export interface CommandResult {
  output: string;
  error?: string;
  requiresPermission?: Permission;
}