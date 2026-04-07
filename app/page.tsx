'use client';

import { AppProvider } from '@/components/providers';
import { useAppContext } from '@/lib/context';
import { Navbar } from '@/components/layout/navbar';
import { LandingPage } from '@/components/pages/landing-page';
import { LoginPage } from '@/components/pages/login-page';
import { HomePage } from '@/components/pages/home-page';
import { PatientDetailPage } from '@/components/pages/patient-detail-page';
import { PatientDashboardPage } from '@/components/pages/patient-dashboard-page';

function AppContent() {
  const { currentPage } = useAppContext();

  return (
    <>
      <Navbar />
      <main>
        {currentPage === 'landing' && <LandingPage />}
        {currentPage === 'login' && <LoginPage />}
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'patient-detail' && <PatientDetailPage />}
        {currentPage === 'patient-dashboard' && <PatientDashboardPage />}
      </main>
    </>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
