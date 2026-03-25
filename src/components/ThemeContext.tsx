"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface Theme {
  accent: string;      // "99, 102, 241"
  hex: string;         // "#6366f1"
  light: string;       // "#a78bfa"
}

const defaultTheme: Theme = {
  accent: "99, 102, 241",
  hex: "#6366f1",
  light: "#a78bfa",
};

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: defaultTheme, setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.style.setProperty("--accent-hex", t.hex);
    document.documentElement.style.setProperty("--accent-light", t.light);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
