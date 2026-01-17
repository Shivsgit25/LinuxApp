import { Command } from '../core/types';
import { Platform } from 'react-native';

export class CPUCommand implements Command {
  name = 'cpu';
  description = 'Show CPU usage';

  async execute(): Promise<string> {
    // Mock CPU data - would require native implementation
    const usage = Math.floor(Math.random() * 100);
    const cores = Platform.OS === 'android' ? 8 : 6;
    
    return `CPU Usage: ${usage}%
Cores: ${cores}
Architecture: ${Platform.OS === 'android' ? 'ARM64' : 'A15 Bionic'}
Temperature: ${Math.floor(Math.random() * 20) + 35}°C`;
  }
}

export class RAMCommand implements Command {
  name = 'ram';
  description = 'Show memory usage';

  async execute(): Promise<string> {
    // Mock RAM data
    const total = Platform.OS === 'android' ? 8192 : 6144;
    const used = Math.floor(total * (0.4 + Math.random() * 0.4));
    const free = total - used;
    const percentage = Math.floor((used / total) * 100);
    
    return `Memory Usage: ${percentage}%
Used: ${used}MB
Free: ${free}MB  
Total: ${total}MB
Swap: ${Platform.OS === 'android' ? '2GB' : 'N/A'}`;
  }
}

export class StorageCommand implements Command {
  name = 'storage';
  description = 'Show storage usage';

  async execute(): Promise<string> {
    // Mock storage data
    const total = 128;
    const used = Math.floor(total * (0.3 + Math.random() * 0.5));
    const free = total - used;
    const percentage = Math.floor((used / total) * 100);
    
    return `Storage Usage: ${percentage}%
Used: ${used}GB
Free: ${free}GB
Total: ${total}GB

Largest folders:
Photos: 25GB
Apps: 18GB
System: 12GB`;
  }
}

export class NetworkCommand implements Command {
  name = 'network';
  description = 'Show network statistics';

  async execute(args: string[]): Promise<string> {
    if (args.includes('stats')) {
      return this.getNetworkStats();
    }
    
    return this.getNetworkInfo();
  }

  private getNetworkInfo(): string {
    return `Network Status:
WiFi: Connected (Home-5G)
Signal: -45 dBm (Excellent)
Speed: 150 Mbps down / 50 Mbps up
IP: 192.168.1.42
DNS: 8.8.8.8, 1.1.1.1

Mobile Data: Available (5G)
Carrier: Carrier Name`;
  }

  private getNetworkStats(): string {
    return `Network Statistics:
Downloaded: 2.3GB today
Uploaded: 456MB today
Apps using data:
- YouTube: 1.2GB
- WhatsApp: 234MB  
- Chrome: 189MB
- Spotify: 156MB`;
  }
}

export class TopCommand implements Command {
  name = 'top';
  description = 'Show running processes';

  async execute(): Promise<string> {
    // Mock process data
    const processes = [
      'TermiPhone     15.2%  128MB',
      'System UI      8.1%   89MB',
      'WhatsApp       4.3%   156MB',
      'Chrome         3.8%   234MB',
      'Spotify        2.1%   98MB',
      'Gmail          1.9%   67MB',
      'Maps           1.2%   45MB'
    ];
    
    return `PID  PROCESS        CPU   MEM
${processes.map((proc, i) => `${(i + 1).toString().padStart(3)} ${proc}`).join('\n')}

Press Ctrl+C to exit live mode`;
  }
}