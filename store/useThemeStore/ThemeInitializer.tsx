"use client";

import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { Theme } from './interface';

export function ThemeInitializer() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        useThemeStore.getState().setTheme(savedTheme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        useThemeStore.getState().setTheme('dark');
      }
      initialized.current = true;
    }
  }, []);

  return null;
}
