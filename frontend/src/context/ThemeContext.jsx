import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('thermox_theme');
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('thermox_theme', isDark ? 'dark' : 'light');
    document.body.style.backgroundColor = isDark ? '#090d16' : '#f8fafc';
    document.body.style.color = isDark ? '#f1f5f9' : '#0f172a';
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Modern Semantic Theme Tokens
  const theme = {
    isDark,
    toggleTheme,
    colors: {
      bgApp: isDark ? '#090d16' : '#f8fafc',
      bgCard: isDark ? '#111827' : '#ffffff',
      bgCardElevated: isDark ? '#1a2234' : '#f1f5f9',
      bgSubtle: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
      border: isDark ? '#1f293d' : '#e2e8f0',
      borderSubtle: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
      textPrimary: isDark ? '#f8fafc' : '#0f172a',
      textSecondary: isDark ? '#94a3b8' : '#64748b',
      textMuted: isDark ? '#64748b' : '#94a3b8',
      accentPrimary: '#3b82f6',
      accentHover: '#2563eb',
      accentGlow: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)',
      
      // Thermal gradients
      heatGrad: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
      coolGrad: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      totalGrad: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      
      // Badge backgrounds
      heatBg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
      heatText: isDark ? '#fca5a5' : '#b91c1c',
      coolBg: isDark ? 'rgba(6, 182, 212, 0.15)' : '#e0f2fe',
      coolText: isDark ? '#7dd3fc' : '#0369a1',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
