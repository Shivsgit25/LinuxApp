import { Command } from '../core/types';
import { ThemeManager } from '../storage/ThemeManager';
import { Theme } from '../core/theme-types';

export class ThemeCommand implements Command {
  name = 'theme';
  description = 'Manage terminal themes';
  
  constructor(private themeManager: ThemeManager) {}

  async execute(args: string[]): Promise<string> {
    if (args.length === 0) {
      return 'Usage: theme list | theme set <name> | theme custom | theme reset';
    }

    const subcommand = args[0];

    switch (subcommand) {
      case 'list':
        return this.listThemes();
      case 'set':
        return this.setTheme(args[1]);
      case 'custom':
        return this.customTheme(args.slice(1));
      case 'reset':
        return this.resetTheme();
      default:
        return `Unknown subcommand: ${subcommand}`;
    }
  }

  private listThemes(): string {
    const themes = this.themeManager.listThemes();
    const current = this.themeManager.getTheme().name;
    
    return themes.map(theme => 
      theme === current ? `* ${theme} (current)` : `  ${theme}`
    ).join('\n');
  }

  private setTheme(name: string): string {
    if (!name) {
      return 'Usage: theme set <name>';
    }

    if (this.themeManager.setTheme(name)) {
      return `Theme set to: ${name}`;
    }
    
    return `Theme not found: ${name}`;
  }

  private customTheme(args: string[]): string {
    const flags = this.parseFlags(args);
    
    if (Object.keys(flags).length === 0) {
      return `Usage: theme custom --bg <color> --text <color> --cursor <color> --prompt <color>
Example: theme custom --bg #0d1117 --text #58a6ff --cursor #f78166 --prompt #7ee787`;
    }

    const currentTheme = this.themeManager.getTheme();
    const customTheme: Theme = {
      name: 'custom',
      background: flags.bg || currentTheme.background,
      text: flags.text || currentTheme.text,
      prompt: flags.prompt || currentTheme.prompt,
      cursor: flags.cursor || currentTheme.cursor,
      error: flags.error || currentTheme.error,
      success: flags.success || currentTheme.success,
      selection: flags.selection || currentTheme.selection,
      comment: flags.comment || currentTheme.comment
    };

    this.themeManager.createCustomTheme(customTheme);
    this.themeManager.setTheme('custom');
    
    return 'Custom theme created and applied';
  }

  private resetTheme(): string {
    this.themeManager.resetTheme();
    return 'Theme reset to default (hacker-green)';
  }

  private parseFlags(args: string[]): Record<string, string> {
    const flags: Record<string, string> = {};
    
    for (let i = 0; i < args.length; i += 2) {
      if (args[i]?.startsWith('--') && args[i + 1]) {
        const flag = args[i].replace('--', '');
        flags[flag] = args[i + 1];
      }
    }
    
    return flags;
  }
}