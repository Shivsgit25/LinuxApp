import { Command } from '../core/types';
import { MMKV } from 'react-native-mmkv';

interface Plugin {
  name: string;
  version: string;
  commands: Command[];
  enabled: boolean;
}

export class PluginManager {
  private storage = new MMKV({ id: 'termiphone-plugins' });
  private plugins: Map<string, Plugin> = new Map();

  constructor() {
    this.loadBuiltinPlugins();
  }

  registerPlugin(plugin: Plugin): void {
    this.plugins.set(plugin.name, plugin);
    this.storage.set(`plugin-${plugin.name}`, JSON.stringify({
      name: plugin.name,
      version: plugin.version,
      enabled: plugin.enabled
    }));
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  listPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  enablePlugin(name: string): boolean {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.enabled = true;
      this.storage.set(`plugin-${name}`, JSON.stringify({
        name: plugin.name,
        version: plugin.version,
        enabled: true
      }));
      return true;
    }
    return false;
  }

  disablePlugin(name: string): boolean {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.enabled = false;
      this.storage.set(`plugin-${name}`, JSON.stringify({
        name: plugin.name,
        version: plugin.version,
        enabled: false
      }));
      return true;
    }
    return false;
  }

  private loadBuiltinPlugins(): void {
    // Weather plugin
    this.registerPlugin({
      name: 'weather',
      version: '1.0.0',
      commands: [new WeatherCommand()],
      enabled: true
    });

    // Crypto plugin
    this.registerPlugin({
      name: 'crypto',
      version: '1.0.0',
      commands: [new CryptoCommand()],
      enabled: true
    });
  }
}

export class PluginCommand implements Command {
  name = 'plugin';
  description = 'Manage plugins';

  constructor(private pluginManager: PluginManager) {}

  async execute(args: string[]): Promise<string> {
    if (args.length === 0) {
      return 'Usage: plugin list | plugin enable <name> | plugin disable <name>';
    }

    const subcommand = args[0];

    switch (subcommand) {
      case 'list':
        return this.listPlugins();
      case 'enable':
        return this.enablePlugin(args[1]);
      case 'disable':
        return this.disablePlugin(args[1]);
      default:
        return `Unknown subcommand: ${subcommand}`;
    }
  }

  private listPlugins(): string {
    const plugins = this.pluginManager.listPlugins();
    
    if (plugins.length === 0) {
      return 'No plugins installed';
    }

    return plugins.map(plugin => 
      `${plugin.name} v${plugin.version} ${plugin.enabled ? '✓' : '✗'}`
    ).join('\n');
  }

  private enablePlugin(name: string): string {
    if (!name) {
      return 'Usage: plugin enable <name>';
    }

    if (this.pluginManager.enablePlugin(name)) {
      return `Plugin '${name}' enabled`;
    }
    
    return `Plugin '${name}' not found`;
  }

  private disablePlugin(name: string): string {
    if (!name) {
      return 'Usage: plugin disable <name>';
    }

    if (this.pluginManager.disablePlugin(name)) {
      return `Plugin '${name}' disabled`;
    }
    
    return `Plugin '${name}' not found`;
  }
}

// Built-in plugin commands
class WeatherCommand implements Command {
  name = 'weather';
  description = 'Get weather information';

  async execute(args: string[]): Promise<string> {
    const location = args[0] || 'current location';
    
    // Mock weather data
    return `Weather for ${location}:
🌤️  Partly Cloudy
🌡️  Temperature: 24°C (feels like 26°C)
💨 Wind: 12 km/h NE
💧 Humidity: 65%
🌅 Sunrise: 06:30 AM
🌇 Sunset: 07:45 PM

3-day forecast:
Tomorrow: ☀️ 28°C / 18°C
Day 2: 🌧️ 22°C / 16°C  
Day 3: ⛅ 25°C / 19°C`;
  }
}

class CryptoCommand implements Command {
  name = 'crypto';
  description = 'Get cryptocurrency prices';

  async execute(args: string[]): Promise<string> {
    const coin = args[0]?.toLowerCase() || 'btc';
    
    // Mock crypto data
    const prices: Record<string, any> = {
      'btc': { name: 'Bitcoin', price: '$43,250', change: '+2.4%' },
      'eth': { name: 'Ethereum', price: '$2,680', change: '+1.8%' },
      'ada': { name: 'Cardano', price: '$0.52', change: '-0.3%' },
      'sol': { name: 'Solana', price: '$98.50', change: '+5.2%' }
    };

    const data = prices[coin];
    
    if (!data) {
      return `Cryptocurrency '${coin}' not found`;
    }

    return `${data.name} (${coin.toUpperCase()})
💰 Price: ${data.price}
📈 24h Change: ${data.change}
📊 Market Cap: $825.4B
📈 Volume: $28.5B`;
  }
}