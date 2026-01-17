import { Command } from '../core/types';
import { ThemeManager } from '../storage/ThemeManager';

export class MacroCommand implements Command {
  name = 'macro';
  description = 'Create and manage command macros';
  
  constructor(private themeManager: ThemeManager) {}

  async execute(args: string[]): Promise<string> {
    if (args.length === 0) {
      return 'Usage: macro create <name> | macro list | macro run <name>';
    }

    const subcommand = args[0];

    switch (subcommand) {
      case 'create':
        return this.createMacro(args[1]);
      case 'list':
        return this.listMacros();
      case 'run':
        return this.runMacro(args[1]);
      default:
        return `Unknown subcommand: ${subcommand}`;
    }
  }

  private createMacro(name: string): string {
    if (!name) {
      return 'Usage: macro create <name>';
    }

    return `Macro creation mode for '${name}':
Enter commands (one per line), type 'end' to finish:

Example:
wifi on
bluetooth off
open spotify
volume 40
end`;
  }

  private listMacros(): string {
    const macros = this.themeManager.listMacros();
    
    if (macros.length === 0) {
      return 'No macros created';
    }

    return `Available macros:
${macros.join('\n')}`;
  }

  private runMacro(name: string): string {
    if (!name) {
      return 'Usage: macro run <name>';
    }

    const macro = this.themeManager.getMacro(name);
    
    if (!macro) {
      return `Macro not found: ${name}`;
    }

    return `Running macro '${name}':
${macro.commands.join('\n')}`;
  }
}

export class RunCommand implements Command {
  name = 'run';
  description = 'Run macros and scripts';
  
  constructor(private themeManager: ThemeManager) {}

  async execute(args: string[]): Promise<string> {
    if (args.length === 0) {
      return 'Usage: run <macro_name>';
    }

    const macroName = args[0];
    const macro = this.themeManager.getMacro(macroName);
    
    if (!macro) {
      return `Macro not found: ${macroName}`;
    }

    return `Executing macro '${macroName}'...
${macro.commands.join('\n')}`;
  }
}