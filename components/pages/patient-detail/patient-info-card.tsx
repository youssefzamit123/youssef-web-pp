'use client';

import type { Patient } from '@/lib/types';

interface PatientInfoCardProps {
  patient: Patient;
}

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4">Informations patient</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Date de naissance</p>
          <p className="font-medium text-foreground">{patient.dateOfBirth || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Téléphone</p>
          <p className="font-medium text-foreground">{patient.phone || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Dernière visite</p>
          <p className="font-medium text-foreground">{patient.lastVisit}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Historique médical</p>
          <p className="font-medium text-foreground">{patient.medicalHistory || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Dentiste</p>
          <p className="font-medium text-foreground">{patient.doctor || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Assurance</p>
          <p className="font-medium text-foreground">{patient.insurance || '-'}</p>
        </div>
      </div>
    </div>
  );
}
