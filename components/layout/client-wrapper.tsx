'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { AppProvider } from '@/components/providers';
import { Navbar } from '@/components/layout/navbar';
// GlobalThemeToggle removed: theme toggle now lives in the Navbar
import { FacebookChatDock } from '@/components/layout/facebook-chat-dock';
import { WorkspaceSidebar } from '@/components/layout/workspace-sidebar';
import { ChatBubble } from '@/components/layout/chat-bubble';

export function ClientWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const showWorkspaceShell = pathname !== '/' && pathname !== '/login';

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AppProvider>
        {showWorkspaceShell && <WorkspaceSidebar />}
        <div className={showWorkspaceShell ? 'xl:pl-72' : ''}>
          <Navbar />
          <main>{children}</main>
        </div>
        <FacebookChatDock />
        <ChatBubble />
      </AppProvider>
    </ThemeProvider>
  );
}