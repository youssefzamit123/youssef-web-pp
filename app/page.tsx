'use client';

import { AppProvider } from '@/components/providers';
import { ThemeProvider } from '@/components/theme-provider';
import { useAppContext } from '@/lib/context';
import { Navbar } from '@/components/layout/navbar';
import { GlobalThemeToggle } from '@/components/layout/global-theme-toggle';
import { LandingPage } from '@/components/pages/landing-page';
import { LoginPage } from '@/components/pages/login-page';
import { HomePage } from '@/components/pages/home-page';
import { PatientDetailPage } from '@/components/pages/patient-detail-page';
import { PatientDashboardPage } from '@/components/pages/patient-dashboard-page';
import { KidsZonePage } from '@/components/pages/kids-zone-page';
import { FacebookChatDock } from '@/components/layout/facebook-chat-dock';

function AppContent() {
  const { currentPage } = useAppContext();

  return (
    <>
      <Navbar />
      <GlobalThemeToggle />
      <main>
        {currentPage === 'landing' && <LandingPage />}
        {currentPage === 'login' && <LoginPage />}
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'patient-detail' && <PatientDetailPage />}
        {currentPage === 'patient-dashboard' && <PatientDashboardPage />}
        {currentPage === 'kids-zone' && <KidsZonePage />}
      </main>
      <FacebookChatDock />
    </>
  );
}

export default function Page() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
