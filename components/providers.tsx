'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AppContext } from '@/lib/context';
import type { User, Patient, AppPage } from '@/lib/types';

const USER_STORAGE_KEY = 'dentai-user';
const SELECTED_PATIENT_STORAGE_KEY = 'dentai-selected-patient';
const CURRENT_PAGE_STORAGE_KEY = 'dentai-current-page';

function readStoredJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}


export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<AppPage>(() => readStoredJson<AppPage>(CURRENT_PAGE_STORAGE_KEY) || 'landing');
  const [user, setUser] = useState<User | null>(() => readStoredJson<User>(USER_STORAGE_KEY));
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(() => readStoredJson<Patient>(SELECTED_PATIENT_STORAGE_KEY));

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (selectedPatient) {
      window.localStorage.setItem(SELECTED_PATIENT_STORAGE_KEY, JSON.stringify(selectedPatient));
    } else {
      window.localStorage.removeItem(SELECTED_PATIENT_STORAGE_KEY);
    }
  }, [selectedPatient]);

  useEffect(() => {
    if (currentPage) {
      window.localStorage.setItem(CURRENT_PAGE_STORAGE_KEY, currentPage);
    }
  }, [currentPage]);

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
