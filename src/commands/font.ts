import { Command } from '../core/types';
import { ThemeManager } from '../storage/ThemeManager';

export class FontCommand implements Command {
  name = 'font';
  description = 'Manage terminal fonts';
  
  constructor(private themeManager: ThemeManager) {}

  async execute(args: string[]): Promise<string> {
    if (args.length === 0) {
      return 'Usage: font list | font set <family> | font size <number> | font ligatures on/off';
    }

    const subcommand = args[0];

    switch (subcommand) {
      case 'list':
        return this.listFonts();
      case 'set':
        return this.setFont(args[1]);
      case 'size':
        return this.setSize(args[1]);
      case 'ligatures':
        return this.setLigatures(args[1]);
      default:
        return `Unknown subcommand: ${subcommand}`;
    }
  }

  private listFonts(): string {
    const fonts = [
      'monospace (default)',
      'JetBrains Mono',
      'Fira Code',
      'Source Code Pro',
      'Hack',
      'Courier New'
    ];
    
    const current = this.themeManager.getFont();
    
    return `Available fonts:
${fonts.join('\n')}

Current: ${current.family} (${current.size}px)
Ligatures: ${current.ligatures ? 'on' : 'off'}`;
  }

  private setFont(family: string): string {
    if (!family) {
      return 'Usage: font set <family>';
    }

    this.themeManager.setFont(family);
    return `Font set to: ${family}`;
  }

  private setSize(sizeStr: string): string {
    const size = parseInt(sizeStr);
    
    if (isNaN(size) || size < 8 || size > 32) {
      return 'Font size must be between 8 and 32';
    }

    const current = this.themeManager.getFont();
    this.themeManager.setFont(current.family, size);
    
    return `Font size set to: ${size}px`;
  }

  private setLigatures(state: string): string {
    if (state !== 'on' && state !== 'off') {
      return 'Usage: font ligatures on/off';
    }

    const current = this.themeManager.getFont();
    this.themeManager.setFont(current.family, current.size, state === 'on');
    
    return `Font ligatures: ${state}`;
  }
}