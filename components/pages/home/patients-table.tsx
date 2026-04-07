'use client';

import { useAppContext } from '@/lib/context';
import { RiskBadge } from '@/components/common/risk-badge';
import type { Patient } from '@/lib/types';

interface PatientsTableProps {
  patients: Patient[];
}

export function PatientsTable({ patients }: PatientsTableProps) {
  const { setSelectedPatient, setCurrentPage } = useAppContext();

  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentPage('patient-detail');
  };

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-secondary border-b border-border">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Patient</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Âge</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Risque</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Dernière visite</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {patients.map(patient => (
            <tr
              key={patient.id}
              onClick={() => handleRowClick(patient)}
              className="hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {patient.name
                        .split(' ')
                        .slice(0, 2)
                        .map(n => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{patient.name}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{patient.age}</td>
              <td className="px-6 py-4">
                <RiskBadge level={patient.riskLevel} size="sm" />
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{patient.lastVisit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
