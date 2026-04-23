'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AppProvider } from '@/components/providers';
import { Navbar } from '@/components/layout/navbar';
import { GlobalThemeToggle } from '@/components/layout/global-theme-toggle';
import { FacebookChatDock } from '@/components/layout/facebook-chat-dock';

export function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AppProvider>
        <Navbar />
        <GlobalThemeToggle />
        <main>{children}</main>
        <FacebookChatDock />
      </AppProvider>
    </ThemeProvider>
  );
}