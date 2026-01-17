import React, { useEffect, useState } from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { Terminal } from './src/ui/Terminal';
import { CommandExecutor } from './src/core/executor';
import { ThemeManager } from './src/storage/ThemeManager';
import { 
  HelpCommand, 
  ClearCommand, 
  ExitCommand, 
  WhoamiCommand, 
  UptimeCommand, 
  BatteryCommand, 
  DateCommand, 
  TimeCommand 
} from './src/commands/system';
import { CallCommand } from './src/commands/call';
import { SMSCommand } from './src/commands/sms';
import { AppsCommand, OpenCommand } from './src/commands/apps';
import { ThemeCommand } from './src/commands/theme';
import { FontCommand } from './src/commands/font';
import { WorkspaceCommand } from './src/commands/workspace';
import { MacroCommand, RunCommand } from './src/commands/macro';
import { LockdownCommand, NotifyCommand } from './src/commands/lockdown';
import { CPUCommand, RAMCommand, StorageCommand, NetworkCommand, TopCommand } from './src/commands/system-monitor';
import { StealthCommand, PanicCommand, DevCommand } from './src/commands/security';
import { PluginManager, PluginCommand } from './src/core/PluginManager';

const App: React.FC = () => {
  const [executor] = useState(() => new CommandExecutor());
  const [themeManager] = useState(() => new ThemeManager());
  const [history, setHistory] = useState<string[]>([]);
  const [currentTheme, setCurrentTheme] = useState(themeManager.getTheme());
  const [currentFont, setCurrentFont] = useState(themeManager.getFont());

  useEffect(() => {
    // Register all commands
    const router = executor.getRouter();
    
    // System commands
    router.register(new HelpCommand());
    router.register(new ClearCommand());
    router.register(new ExitCommand());
    router.register(new WhoamiCommand());
    router.register(new UptimeCommand());
    router.register(new BatteryCommand());
    router.register(new DateCommand());
    router.register(new TimeCommand());
    
    // Communication commands
    router.register(new CallCommand());
    router.register(new SMSCommand());
    
    // App management commands
    router.register(new AppsCommand());
    router.register(new OpenCommand());
    
    // Advanced commands
    router.register(new ThemeCommand(themeManager));
    router.register(new FontCommand(themeManager));
    router.register(new WorkspaceCommand(themeManager));
    router.register(new MacroCommand(themeManager));
    router.register(new RunCommand(themeManager));
    router.register(new LockdownCommand());
    router.register(new NotifyCommand());
    
    // Security & Privacy
    router.register(new StealthCommand());
    router.register(new PanicCommand());
    router.register(new DevCommand());
    
    // Plugin system
    const pluginManager = new PluginManager();
    router.register(new PluginCommand(pluginManager));
    
    // Register plugin commands
    pluginManager.listPlugins().forEach(plugin => {
      if (plugin.enabled) {
        plugin.commands.forEach(cmd => router.register(cmd));
      }
    });
    
    // System monitoring
    router.register(new CPUCommand());
    router.register(new RAMCommand());
    router.register(new StorageCommand());
    router.register(new NetworkCommand());
    router.register(new TopCommand());
    
    // Register common aliases
    router.registerAlias('ls', 'apps');
    router.registerAlias('mom', 'call -u mom');
    router.registerAlias('dad', 'call -u dad');
    router.registerAlias('ps', 'top');
    router.registerAlias('df', 'storage');
    router.registerAlias('free', 'ram');
    router.registerAlias('htop', 'top');
    router.registerAlias('cls', 'clear');
    router.registerAlias('q', 'exit');
  }, [executor, themeManager]);

  const handleCommand = async (command: string) => {
    const result = await executor.execute(command);
    setHistory(executor.getHistory());
    
    // Update theme/font if changed
    setCurrentTheme(themeManager.getTheme());
    setCurrentFont(themeManager.getFont());
    
    return {
      output: result.output,
      error: result.error,
    };
  };

  const handleAutocomplete = (input: string): string[] => {
    return executor.autocomplete(input);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={currentTheme.background} />
      <Terminal
        onCommand={handleCommand}
        onAutocomplete={handleAutocomplete}
        history={history}
        theme={currentTheme}
        font={currentFont}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;