'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'hotdog';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  isHotdogMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);
  const applyTheme = (mode: ThemeMode) => {
    // Remove all theme classes
    document.documentElement.classList.remove('dark', 'hotdog');
    
    // Add the appropriate class
    if (mode !== 'light') {
      document.documentElement.classList.add(mode);
    }
    
    // Store the theme preference
    localStorage.setItem('theme', mode);
    setThemeMode(mode);
  };

  useEffect(() => {
    setMounted(true);
    
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply the saved theme or use system preference
    if (savedTheme === 'dark' || (!savedTheme && systemDarkMode)) {
      applyTheme('dark');
    } else if (savedTheme === 'hotdog') {
      applyTheme('hotdog');
    } else {
      applyTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    // Cycle through three modes: light -> dark -> hotdog -> light
    const nextMode = themeMode === 'light' 
      ? 'dark' 
      : themeMode === 'dark' 
        ? 'hotdog' 
        : 'light';
    applyTheme(nextMode);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ 
        themeMode: 'light', 
        isDarkMode: false, 
        isHotdogMode: false,
        toggleTheme: () => {},
        setThemeMode: () => {} 
      }}>
        {children}
      </ThemeContext.Provider>    );
  }

  return (
    <ThemeContext.Provider value={{ 
      themeMode, 
      isDarkMode: themeMode === 'dark', 
      isHotdogMode: themeMode === 'hotdog',
      toggleTheme,
      setThemeMode: applyTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
