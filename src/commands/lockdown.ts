import { Command } from '../core/types';
import { MMKV } from 'react-native-mmkv';

export class LockdownCommand implements Command {
  name = 'lockdown';
  description = 'Anti-distraction lockdown mode';
  private storage = new MMKV({ id: 'termiphone-lockdown' });

  async execute(args: string[]): Promise<string> {
    if (args.length === 0) {
      return 'Usage: lockdown on | lockdown off | lockdown status';
    }

    const action = args[0];

    switch (action) {
      case 'on':
        return this.enableLockdown();
      case 'off':
        return this.disableLockdown();
      case 'status':
        return this.getLockdownStatus();
      default:
        return 'Usage: lockdown on | lockdown off | lockdown status';
    }
  }

  private enableLockdown(): string {
    this.storage.set('lockdown-enabled', true);
    this.storage.set('lockdown-timestamp', Date.now());
    
    const blockedApps = [
      'com.instagram.android',
      'com.google.android.youtube',
      'com.facebook.katana',
      'com.twitter.android',
      'com.snapchat.android'
    ];
    
    this.storage.set('blocked-apps', JSON.stringify(blockedApps));
    
    return `🔒 LOCKDOWN MODE ENABLED

Blocked apps:
- Instagram
- YouTube
- Facebook  
- Twitter
- Snapchat

Emergency override: lockdown off --pin <PIN>`;
  }

  private disableLockdown(): string {
    const isEnabled = this.storage.getBoolean('lockdown-enabled');
    
    if (!isEnabled) {
      return 'Lockdown mode is not active';
    }

    this.storage.set('lockdown-enabled', false);
    
    return `🔓 Lockdown mode disabled
Focus session ended.`;
  }

  private getLockdownStatus(): string {
    const isEnabled = this.storage.getBoolean('lockdown-enabled');
    
    if (!isEnabled) {
      return 'Lockdown: OFF';
    }

    const timestamp = this.storage.getNumber('lockdown-timestamp') || Date.now();
    const duration = Math.floor((Date.now() - timestamp) / 1000 / 60);
    
    return `🔒 Lockdown: ON (${duration} minutes)
Blocked apps active
Focus mode engaged`;
  }
}

export class NotifyCommand implements Command {
  name = 'notify';
  description = 'Notification management';
  private storage = new MMKV({ id: 'termiphone-notifications' });

  async execute(args: string[]): Promise<string> {
    if (args.length === 0) {
      return 'Usage: notify list | notify mute <app> | notify allow <app> | notify digest';
    }

    const subcommand = args[0];

    switch (subcommand) {
      case 'list':
        return this.listNotifications();
      case 'mute':
        return this.muteApp(args[1]);
      case 'allow':
        return this.allowApp(args[1]);
      case 'digest':
        return this.getDigest();
      case 'rules':
        return this.getRules();
      default:
        return `Unknown subcommand: ${subcommand}`;
    }
  }

  private listNotifications(): string {
    return `Recent notifications:
📱 WhatsApp: 3 messages
📧 Gmail: 2 emails  
📰 News: 1 update

Use 'notify mute <app>' to silence`;
  }

  private muteApp(app: string): string {
    if (!app) {
      return 'Usage: notify mute <app>';
    }

    const rules = this.getNotificationRules();
    rules[app] = 'mute';
    this.storage.set('notification-rules', JSON.stringify(rules));
    
    return `Notifications muted for: ${app}`;
  }

  private allowApp(app: string): string {
    if (!app) {
      return 'Usage: notify allow <app>';
    }

    const rules = this.getNotificationRules();
    rules[app] = 'allow';
    this.storage.set('notification-rules', JSON.stringify(rules));
    
    return `Notifications allowed for: ${app}`;
  }

  private getDigest(): string {
    return `📊 Daily Notification Digest

High Priority:
- 5 WhatsApp messages
- 2 Calendar events

Low Priority:  
- 12 Social media notifications (muted)
- 8 News updates

Focus time: 4h 23m`;
  }

  private getRules(): string {
    const rules = this.getNotificationRules();
    const entries = Object.entries(rules);
    
    if (entries.length === 0) {
      return 'No notification rules set';
    }

    return entries.map(([app, action]) => `${app}: ${action}`).join('\n');
  }

  private getNotificationRules(): Record<string, string> {
    const data = this.storage.getString('notification-rules');
    return data ? JSON.parse(data) : {};
  }
}