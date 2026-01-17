export interface Theme {
  name: string;
  background: string;
  text: string;
  prompt: string;
  cursor: string;
  error: string;
  success: string;
  selection: string;
  comment: string;
}

export interface FontConfig {
  family: string;
  size: number;
  ligatures: boolean;
}

export interface Workspace {
  name: string;
  theme: string;
  aliases: Record<string, string>;
  history: string[];
  notificationRules: NotificationRule[];
}

export interface NotificationRule {
  app: string;
  action: 'allow' | 'mute' | 'summary';
}

export interface Macro {
  name: string;
  commands: string[];
}

export interface Plugin {
  name: string;
  version: string;
  commands: string[];
  enabled: boolean;
}

export const BUILTIN_THEMES: Record<string, Theme> = {
  'hacker-green': {
    name: 'hacker-green',
    background: '#000000',
    text: '#00FF00',
    prompt: '#00FF00',
    cursor: '#00FF00',
    error: '#FF0000',
    success: '#00FF00',
    selection: '#004400',
    comment: '#008800'
  },
  'nord': {
    name: 'nord',
    background: '#2e3440',
    text: '#d8dee9',
    prompt: '#88c0d0',
    cursor: '#81a1c1',
    error: '#bf616a',
    success: '#a3be8c',
    selection: '#434c5e',
    comment: '#616e88'
  },
  'cyberpunk': {
    name: 'cyberpunk',
    background: '#0d1117',
    text: '#ff00ff',
    prompt: '#00ffff',
    cursor: '#ffff00',
    error: '#ff0040',
    success: '#40ff00',
    selection: '#330066',
    comment: '#8800ff'
  },
  'solarized-dark': {
    name: 'solarized-dark',
    background: '#002b36',
    text: '#839496',
    prompt: '#268bd2',
    cursor: '#dc322f',
    error: '#dc322f',
    success: '#859900',
    selection: '#073642',
    comment: '#586e75'
  }
};