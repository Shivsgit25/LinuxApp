import { Command } from '../core/types';
import { Platform, Linking } from 'react-native';
import { AndroidBridge, AppInfo } from '../native/AndroidBridge';
import { IOSBridge } from '../native/IOSBridge';

export class AppsCommand implements Command {
  name = 'apps';
  description = 'Manage applications';

  async execute(args: string[]): Promise<string> {
    if (args.length === 0) {
      return 'Usage: apps list | apps search <name>';
    }

    const subcommand = args[0];

    switch (subcommand) {
      case 'list':
        return this.listApps();
      case 'search':
        if (args.length < 2) {
          return 'Usage: apps search <name>';
        }
        return this.searchApps(args[1]);
      default:
        return 'Unknown subcommand. Usage: apps list | apps search <name>';
    }
  }

  private async listApps(): Promise<string> {
    try {
      const bridge = Platform.OS === 'android' ? AndroidBridge : IOSBridge;
      const apps = await bridge.getInstalledApps();
      
      if (apps.length === 0) {
        return 'No apps found';
      }

      return apps
        .map(app => `${app.appName.padEnd(20)} ${app.packageName}`)
        .join('\n');
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Failed to list apps'}`;
    }
  }

  private async searchApps(query: string): Promise<string> {
    try {
      const bridge = Platform.OS === 'android' ? AndroidBridge : IOSBridge;
      const apps = await bridge.getInstalledApps();
      
      const filtered = apps.filter(app => 
        app.appName.toLowerCase().includes(query.toLowerCase()) ||
        app.packageName.toLowerCase().includes(query.toLowerCase())
      );

      if (filtered.length === 0) {
        return `No apps found matching '${query}'`;
      }

      return filtered
        .map(app => `${app.appName.padEnd(20)} ${app.packageName}`)
        .join('\n');
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Search failed'}`;
    }
  }
}

export class OpenCommand implements Command {
  name = 'open';
  description = 'Open applications';

  async execute(args: string[]): Promise<string> {
    if (args.length === 0) {
      return 'Usage: open <app_name> | open <package_name>';
    }

    const appIdentifier = args[0].toLowerCase();
    return this.openApp(appIdentifier);
  }

  private async openApp(identifier: string): Promise<string> {
    try {
      // Common app mappings
      const appMappings = Platform.OS === 'android' ? {
        'chrome': 'com.android.chrome',
        'youtube': 'com.google.android.youtube',
        'spotify': 'com.spotify.music',
        'whatsapp': 'com.whatsapp',
        'gmail': 'com.google.android.gm',
        'maps': 'com.google.android.apps.maps',
        'camera': 'com.android.camera2',
        'gallery': 'com.google.android.apps.photos',
        'settings': 'com.android.settings'
      } : {
        'chrome': 'googlechrome://',
        'youtube': 'youtube://',
        'spotify': 'spotify://',
        'whatsapp': 'whatsapp://',
        'mail': 'message://',
        'maps': 'maps://',
        'camera': 'camera://',
        'photos': 'photos-redirect://',
        'settings': 'app-settings:'
      };

      const packageName = appMappings[identifier as keyof typeof appMappings] || identifier;
      
      const bridge = Platform.OS === 'android' ? AndroidBridge : IOSBridge;
      await bridge.openApp(packageName);
      
      return `Opening ${identifier}...`;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Failed to open app'}`;
    }
  }
}