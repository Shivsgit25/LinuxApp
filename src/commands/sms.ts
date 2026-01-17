import { Command } from '../core/types';
import { Platform } from 'react-native';
import { AndroidBridge } from '../native/AndroidBridge';
import { IOSBridge } from '../native/IOSBridge';

export class SMSCommand implements Command {
  name = 'sms';
  description = 'Send SMS messages';
  flags = ['-p', '-u', '-t'];

  async execute(args: string[]): Promise<string> {
    const phoneFlag = this.getFlag(args, '-p');
    const userFlag = this.getFlag(args, '-u');
    const textFlag = this.getFlag(args, '-t');

    if (!textFlag) {
      return 'Error: Message text required (-t flag)';
    }

    if (phoneFlag) {
      return this.sendSMSToPhone(phoneFlag, textFlag);
    }

    if (userFlag) {
      return this.sendSMSToContact(userFlag, textFlag);
    }

    return 'Usage: sms -p <phone> -t <message> | sms -u <contact> -t <message>';
  }

  private getFlag(args: string[], flag: string): string | null {
    const index = args.indexOf(flag);
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  }

  private async sendSMSToPhone(phoneNumber: string, message: string): Promise<string> {
    try {
      const bridge = Platform.OS === 'android' ? AndroidBridge : IOSBridge;
      await bridge.sendSMS(phoneNumber, message);
      return `SMS sent to ${phoneNumber}`;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'SMS failed'}`;
    }
  }

  private async sendSMSToContact(contactName: string, message: string): Promise<string> {
    try {
      // Mock contact lookup
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
      await bridge.sendSMS(phoneNumber, message);
      return `SMS sent to ${contactName} (${phoneNumber})`;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'SMS failed'}`;
    }
  }
}