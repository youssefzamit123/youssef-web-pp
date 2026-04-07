'use client';

import { ReactNode, useState } from 'react';
import { AppContext } from '@/lib/context';
import type { User, Patient, AppPage } from '@/lib/types';

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        user,
        selectedPatient,
        setCurrentPage,
        setUser,
        setSelectedPatient,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
