'use client';

import { useEffect, useState } from 'react';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nexcode-theme');
    if (stored === 'dark') {
      setIsDarkMode(true);
    } else if (stored === 'light') {
      setIsDarkMode(false);
    } else if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ) {
      setIsDarkMode(true);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('nexcode-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, mounted]);

  return { isDarkMode, setIsDarkMode, mounted };
}