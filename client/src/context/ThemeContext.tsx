import { createContext, useContext, useEffect, useState } from 'react';
import { z } from 'zod';

const themeSchema = z.union([z.literal('light'), z.literal('dark')]);
type Theme = z.infer<typeof themeSchema>;

type ThemeContextType = {
  theme: Theme;
  switchTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // This sets the theme based on the user's system preference or local storage
  useEffect(() => {
    const localTheme = themeSchema.safeParse(localStorage.getItem('soulsparkTheme'));
    if (localTheme.success) {
      setTheme(localTheme.data);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      localStorage.setItem('soulsparkTheme', 'dark');
    } else {
      setTheme('light');
      localStorage.setItem('soulsparkTheme', 'light');
    }
  }, []);

  const switchTheme = (theme: Theme) => {
    setTheme(theme);
    localStorage.setItem('soulsparkTheme', theme);
  };

  const value: ThemeContextType = {
    theme,
    switchTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return themeContext;
};
