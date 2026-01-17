import { NativeModules, PermissionsAndroid, Linking, DeviceEventEmitter } from 'react-native';

export interface Contact {
  id: string;
  name: string;
  phoneNumbers: string[];
}

export interface AppInfo {
  packageName: string;
  appName: string;
  isSystemApp: boolean;
}

export class AndroidBridge {
  static async requestPermission(permission: string): Promise<boolean> {
    try {
      const granted = await PermissionsAndroid.request(permission as any);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      return false;
    }
  }

  static async checkPermission(permission: string): Promise<boolean> {
    try {
      const result = await PermissionsAndroid.check(permission as any);
      return result;
    } catch (error) {
      return false;
    }
  }

  static async makeCall(phoneNumber: string): Promise<void> {
    const hasPermission = await this.requestPermission(PermissionsAndroid.PERMISSIONS.CALL_PHONE);
    if (!hasPermission) {
      throw new Error('Call permission denied');
    }
    
    await Linking.openURL(`tel:${phoneNumber}`);
  }

  static async sendSMS(phoneNumber: string, message: string): Promise<void> {
    await Linking.openURL(`sms:${phoneNumber}?body=${encodeURIComponent(message)}`);
  }

  static async openApp(packageName: string): Promise<void> {
    try {
      await Linking.openURL(`package:${packageName}`);
    } catch (error) {
      throw new Error(`Cannot open app: ${packageName}`);
    }
  }

  static async getInstalledApps(): Promise<AppInfo[]> {
    // This would require a native module implementation
    // For now, return common apps
    return [
      { packageName: 'com.android.chrome', appName: 'Chrome', isSystemApp: false },
      { packageName: 'com.google.android.youtube', appName: 'YouTube', isSystemApp: false },
      { packageName: 'com.spotify.music', appName: 'Spotify', isSystemApp: false },
      { packageName: 'com.whatsapp', appName: 'WhatsApp', isSystemApp: false },
    ];
  }

  static async getBatteryLevel(): Promise<number> {
    // Would require native implementation
    return 85; // Mock value
  }

  static async getDeviceInfo(): Promise<{ uptime: number; model: string }> {
    // Would require native implementation
    return { uptime: Date.now() - 86400000, model: 'Android Device' };
  }

  static async setWifi(enabled: boolean): Promise<void> {
    // Would require native implementation and CHANGE_WIFI_STATE permission
    throw new Error('WiFi control requires native implementation');
  }

  static async setBluetooth(enabled: boolean): Promise<void> {
    // Would require native implementation and BLUETOOTH_ADMIN permission
    throw new Error('Bluetooth control requires native implementation');
  }

  static async setVolume(level: number): Promise<void> {
    // Would require native implementation
    throw new Error('Volume control requires native implementation');
  }

  static async setBrightness(level: number): Promise<void> {
    // Would require native implementation and WRITE_SETTINGS permission
    throw new Error('Brightness control requires native implementation');
  }

  static async toggleFlashlight(enabled: boolean): Promise<void> {
    // Would require native implementation and CAMERA permission
    throw new Error('Flashlight control requires native implementation');
  }
}