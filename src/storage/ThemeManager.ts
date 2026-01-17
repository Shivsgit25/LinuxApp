import { MMKV } from 'react-native-mmkv';
import { Theme, FontConfig, Workspace, Macro, BUILTIN_THEMES } from './theme-types';

export class ThemeManager {
  private storage = new MMKV({ id: 'termiphone-themes' });
  private currentTheme: Theme = BUILTIN_THEMES['hacker-green'];
  private currentFont: FontConfig = { family: 'monospace', size: 14, ligatures: false };
  private currentWorkspace: string = 'default';

  constructor() {
    this.loadCurrentTheme();
    this.loadCurrentFont();
  }

  // Theme Management
  getTheme(): Theme {
    return this.currentTheme;
  }

  getFont(): FontConfig {
    return this.currentFont;
  }

  listThemes(): string[] {
    const builtin = Object.keys(BUILTIN_THEMES);
    const custom = this.getCustomThemes();
    return [...builtin, ...custom];
  }

  setTheme(name: string): boolean {
    if (BUILTIN_THEMES[name]) {
      this.currentTheme = BUILTIN_THEMES[name];
      this.storage.set('current-theme', name);
      return true;
    }

    const customTheme = this.getCustomTheme(name);
    if (customTheme) {
      this.currentTheme = customTheme;
      this.storage.set('current-theme', name);
      return true;
    }

    return false;
  }

  createCustomTheme(theme: Theme): void {
    this.storage.set(`theme-${theme.name}`, JSON.stringify(theme));
  }

  resetTheme(): void {
    this.currentTheme = BUILTIN_THEMES['hacker-green'];
    this.storage.set('current-theme', 'hacker-green');
  }

  // Font Management
  setFont(family: string, size?: number, ligatures?: boolean): void {
    this.currentFont = {
      family,
      size: size ?? this.currentFont.size,
      ligatures: ligatures ?? this.currentFont.ligatures
    };
    this.storage.set('current-font', JSON.stringify(this.currentFont));
  }

  // Workspace Management
  createWorkspace(name: string): void {
    const workspace: Workspace = {
      name,
      theme: this.currentTheme.name,
      aliases: {},
      history: [],
      notificationRules: []
    };
    this.storage.set(`workspace-${name}`, JSON.stringify(workspace));
  }

  switchWorkspace(name: string): boolean {
    const workspace = this.getWorkspace(name);
    if (workspace) {
      this.currentWorkspace = name;
      this.setTheme(workspace.theme);
      this.storage.set('current-workspace', name);
      return true;
    }
    return false;
  }

  getCurrentWorkspace(): Workspace | null {
    return this.getWorkspace(this.currentWorkspace);
  }

  // Macro Management
  createMacro(name: string, commands: string[]): void {
    const macro: Macro = { name, commands };
    this.storage.set(`macro-${name}`, JSON.stringify(macro));
  }

  getMacro(name: string): Macro | null {
    const data = this.storage.getString(`macro-${name}`);
    return data ? JSON.parse(data) : null;
  }

  listMacros(): string[] {
    const keys = this.storage.getAllKeys();
    return keys.filter(k => k.startsWith('macro-')).map(k => k.replace('macro-', ''));
  }

  private loadCurrentTheme(): void {
    const themeName = this.storage.getString('current-theme');
    if (themeName) {
      this.setTheme(themeName);
    }
  }

  private loadCurrentFont(): void {
    const fontData = this.storage.getString('current-font');
    if (fontData) {
      this.currentFont = JSON.parse(fontData);
    }
  }

  private getCustomThemes(): string[] {
    const keys = this.storage.getAllKeys();
    return keys.filter(k => k.startsWith('theme-')).map(k => k.replace('theme-', ''));
  }

  private getCustomTheme(name: string): Theme | null {
    const data = this.storage.getString(`theme-${name}`);
    return data ? JSON.parse(data) : null;
  }

  private getWorkspace(name: string): Workspace | null {
    const data = this.storage.getString(`workspace-${name}`);
    return data ? JSON.parse(data) : null;
  }
}