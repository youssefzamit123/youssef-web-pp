'use client';

import { ChevronLeft } from 'lucide-react';
import { useAppContext } from '@/lib/context';

export function BackButton() {
  const { setCurrentPage, setSelectedPatient } = useAppContext();

  const handleBack = () => {
    setSelectedPatient(null);
    setCurrentPage('home');
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6"
    >
      <ChevronLeft className="w-4 h-4" />
      Retour à l&apos;accueil
    </button>
  );
}
