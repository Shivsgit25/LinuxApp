import { Command } from '../core/types';
import { Platform } from 'react-native';
import { AndroidBridge } from '../native/AndroidBridge';
import { IOSBridge } from '../native/IOSBridge';

export class CallCommand implements Command {
  name = 'call';
  description = 'Make phone calls';
  flags = ['-p', '-u'];

  async execute(args: string[]): Promise<string> {
    const phoneFlag = this.getFlag(args, '-p');
    const userFlag = this.getFlag(args, '-u');
    
    if (args.includes('last')) {
      return this.callLast();
    }

    if (phoneFlag) {
      return this.callPhone(phoneFlag);
    }

    if (userFlag) {
      return this.callContact(userFlag);
    }

    return 'Usage: call -p <phone> | call -u <contact> | call last';
  }

  private getFlag(args: string[], flag: string): string | null {
    const index = args.indexOf(flag);
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  }

  private async callPhone(phoneNumber: string): Promise<string> {
    try {
      const bridge = Platform.OS === 'android' ? AndroidBridge : IOSBridge;
      await bridge.makeCall(phoneNumber);
      return `Calling ${phoneNumber}...`;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Call failed'}`;
    }
  }

  private async callContact(contactName: string): Promise<string> {
    try {
      // In a real implementation, this would search contacts
      // For now, simulate contact lookup
      const mockContacts = {
        'mom': '+1234567890',
        'dad': '+1234567891',
        'office': '+1234567892',
        'manager': '+1234567893'
      };

      const phoneNumber = mockContacts[contactName.toLowerCase() as keyof typeof mockContacts];
      
      if (!phoneNumber) {
        return `Contact '${contactName}' not found`;
      }

      const bridge = Platform.OS === 'android' ? AndroidBridge : IOSBridge;
      await bridge.makeCall(phoneNumber);
      return `Calling ${contactName} (${phoneNumber})...`;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Call failed'}`;
    }
  }

  private async callLast(): Promise<string> {
    // In a real implementation, this would get the last called number
    return 'call last: feature requires call log access';
  }
}