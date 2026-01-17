# TermiPhone - Linux-Style Terminal for Smartphones

A production-ready React Native mobile application that replaces traditional app navigation with a Linux-like terminal interface.

## 🎯 Features

- **Terminal UI**: Full-screen monospace terminal with blinking cursor
- **Command History**: Navigate with ↑ ↓ arrows
- **Tab Completion**: Auto-complete commands
- **Permission-Aware**: Runtime permission requests
- **Fast Execution**: Commands execute in <100ms
- **Keyboard-First**: Optimized for power users

## 📱 Supported Platforms

- **Android**: Full functionality (primary target)
- **iOS**: Limited functionality due to platform restrictions

## 🧠 Architecture

```
Terminal UI → Command Lexer → Command Parser → Command Router → Command Executor → Native Bridge → System APIs
```

## 📜 Available Commands

### System Commands
- `help` - Show available commands
- `clear` - Clear terminal screen
- `exit` - Exit terminal
- `history` - Show command history
- `whoami` - Show current user
- `uptime` - Show device uptime
- `battery` - Show battery level
- `date` - Show current date
- `time` - Show current time

### Communication Commands
- `call -p <phone>` - Call phone number
- `call -u <contact>` - Call contact by name
- `call last` - Call last number
- `sms -p <phone> -t <message>` - Send SMS to phone
- `sms -u <contact> -t <message>` - Send SMS to contact

### App Management
- `apps list` - List installed applications
- `apps search <name>` - Search for applications
- `open <app_name>` - Open application by name
- `open <package_name>` - Open application by package

### Aliases
- `alias <name>=<command>` - Create command alias
- `unalias <name>` - Remove alias
- Built-in aliases: `mom`, `dad` (call shortcuts)

## 🔐 Required Permissions

### Android
- `CALL_PHONE` - Make phone calls
- `READ_CONTACTS` - Access contact list
- `SEND_SMS` - Send text messages
- `CHANGE_WIFI_STATE` - Control WiFi
- `BLUETOOTH_ADMIN` - Control Bluetooth
- `CAMERA` - Control flashlight
- `WRITE_SETTINGS` - Control brightness
- `QUERY_ALL_PACKAGES` - List installed apps

### iOS
- Limited system access due to platform restrictions
- Basic calling and messaging through URL schemes

## 🚀 Installation

### Prerequisites
- Node.js 16+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)

### Setup
```bash
# Clone repository
git clone <repository-url>
cd TermiPhone

# Install dependencies
npm install

# Install iOS dependencies (iOS only)
cd ios && pod install && cd ..

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run linting
npm run lint
```

## 🛡️ Security & Privacy

- **No Background Data Collection**: App only acts on user commands
- **No Analytics**: No tracking or analytics by default
- **Local Storage**: All data stored locally using MMKV/SQLite
- **Permission-Based**: Features only work with explicit user permission

## ⚡ Performance

- Command execution: <100ms
- Lazy-loaded native modules
- Optimized terminal rendering
- Zero unnecessary re-renders

## 🔧 Configuration

Commands can be customized through:
- Aliases for frequently used commands
- Custom command implementations
- Native module extensions

## 📦 Build Output

- **Android**: APK file ready for distribution
- **iOS**: IPA file (with limitations)

## 🚫 Limitations

### iOS Limitations
- Cannot query installed apps (privacy restriction)
- Limited system control (WiFi, Bluetooth, etc.)
- No direct SMS sending (uses URL schemes)
- No notification access

### Android Limitations
- Some features require root access
- Play Store policy restrictions on certain permissions
- Battery optimization may affect background operations

## 🧑‍💻 Development

### Adding New Commands

1. Create command class implementing `Command` interface
2. Register in `App.tsx`
3. Add to help documentation

Example:
```typescript
export class MyCommand implements Command {
  name = 'mycommand';
  description = 'My custom command';
  
  async execute(args: string[]): Promise<string> {
    return 'Command executed!';
  }
}
```

### Native Module Development

For advanced functionality, implement native modules:
- Android: Kotlin in `android/` directory
- iOS: Swift in `ios/` directory

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Submit pull request

## ⚠️ Disclaimer

This app requires sensitive permissions. Use responsibly and ensure compliance with local laws and regulations regarding phone access and automation.