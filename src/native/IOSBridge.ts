import { Linking } from 'react-native';
import { Contact, AppInfo } from './AndroidBridge';

export class IOSBridge {
  static async makeCall(phoneNumber: string): Promise<void> {
    await Linking.openURL(`tel:${phoneNumber}`);
  }

  static async sendSMS(phoneNumber: string, message: string): Promise<void> {
    await Linking.openURL(`sms:${phoneNumber}&body=${encodeURIComponent(message)}`);
  }

  static async openApp(appScheme: string): Promise<void> {
    try {
      await Linking.openURL(appScheme);
    } catch (error) {
      throw new Error(`Cannot open app: ${appScheme}`);
    }
  }

  static async getInstalledApps(): Promise<AppInfo[]> {
    // iOS doesn't allow querying installed apps due to privacy restrictions
    // Return common app schemes
    return [
      { packageName: 'googlechrome://', appName: 'Chrome', isSystemApp: false },
      { packageName: 'youtube://', appName: 'YouTube', isSystemApp: false },
      { packageName: 'spotify://', appName: 'Spotify', isSystemApp: false },
      { packageName: 'whatsapp://', appName: 'WhatsApp', isSystemApp: false },
    ];
  }

  static async getBatteryLevel(): Promise<number> {
    // Would require native implementation
    return 85; // Mock value
  }

  static async getDeviceInfo(): Promise<{ uptime: number; model: string }> {
    return { uptime: Date.now() - 86400000, model: 'iOS Device' };
  }

  // iOS has limited system control capabilities
  static async setWifi(enabled: boolean): Promise<void> {
    throw new Error('WiFi control not available on iOS');
  }

  static async setBluetooth(enabled: boolean): Promise<void> {
    throw new Error('Bluetooth control not available on iOS');
  }

  static async setVolume(level: number): Promise<void> {
    throw new Error('Volume control not available on iOS');
  }

  static async setBrightness(level: number): Promise<void> {
    throw new Error('Brightness control not available on iOS');
  }

  static async toggleFlashlight(enabled: boolean): Promise<void> {
    throw new Error('Flashlight control requires native implementation');
  }
}