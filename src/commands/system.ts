import { Command } from '../core/types';
import { Platform } from 'react-native';
import { AndroidBridge } from '../native/AndroidBridge';
import { IOSBridge } from '../native/IOSBridge';

export class HelpCommand implements Command {
  name = 'help';
  description = 'Show available commands';

  async execute(args: string[]): Promise<string> {
    return `TermiPhone v1.0 - Advanced Terminal Interface

SYSTEM:
  help                    Show this help
  clear                   Clear terminal
  exit                    Exit terminal
  history                 Show command history
  alias <name>=<cmd>      Create command alias
  unalias <name>          Remove alias
  whoami                  Show current user
  uptime                  Show device uptime
  battery                 Show battery level
  date                    Show current date
  time                    Show current time

THEME & APPEARANCE:
  theme list              List available themes
  theme set <name>        Set theme (hacker-green, nord, cyberpunk)
  theme custom --bg <color> --text <color> --cursor <color>
  theme reset             Reset to default theme
  font list               List available fonts
  font set <family>       Set font family
  font size <number>      Set font size (8-32)
  font ligatures on/off   Toggle font ligatures

WORKSPACES & AUTOMATION:
  workspace create <name> Create new workspace
  workspace switch <name> Switch to workspace
  workspace list          List workspaces
  macro create <name>     Create command macro
  macro list              List macros
  macro run <name>        Run macro
  run <macro>             Execute macro

COMMUNICATION:
  call -p <phone>         Call phone number
  call -u <contact>       Call contact by name
  call last               Call last number
  sms -p <phone> -t <msg> Send SMS to phone
  sms -u <contact> -t <msg> Send SMS to contact

APPS & SYSTEM:
  apps list               List installed apps
  apps search <name>      Search for apps
  open <app>              Open application
  lockdown on/off         Anti-distraction mode
  notify list             List notifications
  notify mute <app>       Mute app notifications
  notify digest           Daily notification summary

SYSTEM MONITORING:
  cpu                     Show CPU usage
  ram                     Show memory usage
  storage                 Show storage usage
  network                 Show network info
  network stats           Network statistics
  top                     Show running processes

CONNECTIVITY:
  wifi on/off             Toggle WiFi
  bluetooth on/off        Toggle Bluetooth
  data on/off             Toggle mobile data

DEVICE CONTROL:
  volume <0-100>          Set volume level
  mute                    Mute device
  brightness <0-100>      Set brightness
  flash on/off            Toggle flashlight

SEARCH:
  search google <query>   Search Google
  search youtube <query>  Search YouTube
  search maps <location>  Search Maps

ALIASES:
  mom, dad               Quick call shortcuts
  ls                     List apps
  ps                     Show processes
  df                     Show storage
  free                   Show memory

Type 'command --help' for specific command help.`;
  }
}

export class ClearCommand implements Command {
  name = 'clear';
  description = 'Clear the terminal screen';

  async execute(): Promise<string> {
    return '\x1b[2J\x1b[H'; // ANSI clear screen codes
  }
}

export class ExitCommand implements Command {
  name = 'exit';
  description = 'Exit the terminal';

  async execute(): Promise<string> {
    // In a real app, this would close the terminal or app
    return 'Goodbye!';
  }
}

export class WhoamiCommand implements Command {
  name = 'whoami';
  description = 'Show current user';

  async execute(): Promise<string> {
    return 'user@phone';
  }
}

export class UptimeCommand implements Command {
  name = 'uptime';
  description = 'Show device uptime';

  async execute(): Promise<string> {
    try {
      const bridge = Platform.OS === 'android' ? AndroidBridge : IOSBridge;
      const info = await bridge.getDeviceInfo();
      const uptimeMs = Date.now() - info.uptime;
      const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
      const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
      return `up ${hours}h ${minutes}m`;
    } catch (error) {
      return 'uptime: unavailable';
    }
  }
}

export class BatteryCommand implements Command {
  name = 'battery';
  description = 'Show battery level';

  async execute(): Promise<string> {
    try {
      const bridge = Platform.OS === 'android' ? AndroidBridge : IOSBridge;
      const level = await bridge.getBatteryLevel();
      return `Battery: ${level}%`;
    } catch (error) {
      return 'battery: unavailable';
    }
  }
}

export class DateCommand implements Command {
  name = 'date';
  description = 'Show current date';

  async execute(): Promise<string> {
    return new Date().toDateString();
  }
}

export class TimeCommand implements Command {
  name = 'time';
  description = 'Show current time';

  async execute(): Promise<string> {
    return new Date().toLocaleTimeString();
  }
}