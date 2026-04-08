'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun } from 'lucide-react';

export function GlobalThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-5 left-5 z-[60] w-11 h-11 rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur-sm hover:scale-105 transition-all flex items-center justify-center"
      title="Basculer thème"
      aria-label="Basculer thème"
    >
      {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
