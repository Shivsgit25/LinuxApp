import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Theme, FontConfig } from '../core/theme-types';

interface TerminalProps {
  onCommand: (command: string) => Promise<{ output: string; error?: string }>;
  onAutocomplete: (input: string) => string[];
  history: string[];
  theme: Theme;
  font: FontConfig;
}

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export const Terminal: React.FC<TerminalProps> = ({
  onCommand,
  onAutocomplete,
  history,
  theme,
  font,
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: 'output',
      content: 'TermiPhone v1.0\nuser@phone:~$ ',
      timestamp: new Date(),
    },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showCursor, setShowCursor] = useState(true);

  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [lines]);

  const handleSubmit = async () => {
    if (!currentInput.trim()) return;

    // Add input line
    const inputLine: TerminalLine = {
      type: 'input',
      content: `user@phone:~$ ${currentInput}`,
      timestamp: new Date(),
    };

    setLines(prev => [...prev, inputLine]);

    try {
      const result = await onCommand(currentInput);
      
      if (result.error) {
        setLines(prev => [...prev, {
          type: 'error',
          content: result.error!,
          timestamp: new Date(),
        }]);
      }

      if (result.output) {
        setLines(prev => [...prev, {
          type: 'output',
          content: result.output,
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      setLines(prev => [...prev, {
        type: 'error',
        content: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      }]);
    }

    setCurrentInput('');
    setHistoryIndex(-1);
  };

  const handleKeyPress = (key: string) => {
    switch (key) {
      case 'Enter':
        handleSubmit();
        break;
      case 'ArrowUp':
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setCurrentInput(history[history.length - 1 - newIndex] || '');
        }
        break;
      case 'ArrowDown':
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCurrentInput(history[history.length - 1 - newIndex] || '');
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCurrentInput('');
        }
        break;
      case 'Tab':
        const suggestions = onAutocomplete(currentInput);
        if (suggestions.length === 1) {
          setCurrentInput(suggestions[0]);
        }
        break;
    }
  };

  const renderLine = (line: TerminalLine, index: number) => {
    const getLineStyle = () => {
      const baseStyle = {
        fontFamily: font.family,
        fontSize: font.size,
        lineHeight: font.size * 1.4,
      };
      
      switch (line.type) {
        case 'error':
          return { ...baseStyle, color: theme.error };
        case 'input':
          return { ...baseStyle, color: theme.text };
        default:
          return { ...baseStyle, color: theme.text };
      }
    };
    
    return (
      <Text key={index} style={getLineStyle()}>
        {line.content}
      </Text>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {lines.map(renderLine)}
        
        <View style={styles.inputLine}>
          <Text style={[styles.prompt, { color: theme.prompt, fontFamily: font.family, fontSize: font.size }]}>user@phone:~$ </Text>
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: theme.text, fontFamily: font.family, fontSize: font.size }]}
            value={currentInput}
            onChangeText={setCurrentInput}
            onSubmitEditing={handleSubmit}
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
            multiline={false}
            blurOnSubmit={false}
            selectionColor={theme.selection}
          />
          {showCursor && <Text style={[styles.cursor, { color: theme.cursor, fontFamily: font.family, fontSize: font.size }]}>_</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  inputLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prompt: {
    // Dynamic styling applied inline
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  cursor: {
    // Dynamic styling applied inline
  },
});

const styles = createStyles({ background: '#000000' } as Theme); // Fallback