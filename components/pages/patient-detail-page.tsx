'use client';

import { useAppContext } from '@/lib/context';
import { mockCariesDetection, mockRiskPredictions } from '@/lib/mock-data';
import { BackButton } from '@/components/layout/back-button';
import { RiskBadge } from '@/components/common/risk-badge';
import { XrayViewer } from './patient-detail/xray-viewer';
import { PatientInfoCard } from './patient-detail/patient-info-card';
import { RiskPredictionCard } from './patient-detail/risk-prediction-card';

export function PatientDetailPage() {
  const { selectedPatient, setCurrentPage } = useAppContext();

  if (!selectedPatient) {
    return (
      <div className="min-h-screen bg-secondary/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🦷</span>
          </div>
          <p className="text-lg font-semibold text-foreground mb-2">Aucun patient sélectionné</p>
          <p className="text-sm text-muted-foreground mb-6">
            Sélectionnez un patient depuis le tableau de bord
          </p>
          <button
            onClick={() => setCurrentPage('home')}
            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <BackButton />

        {/* Patient Profile Banner */}
        <div className="bg-white rounded-xl border border-border/50 p-8 mb-8 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-primary">
                {selectedPatient.name
                  .split(' ')
                  .slice(0, 2)
                  .map(n => n[0])
                  .join('')}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">{selectedPatient.name}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Âge</p>
                  <p className="font-semibold text-foreground">{selectedPatient.age} ans</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Genre</p>
                  <p className="font-semibold text-foreground">
                    {selectedPatient.gender === 'M' ? 'Homme' : 'Femme'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">CIN</p>
                  <p className="font-semibold text-foreground">{selectedPatient.cin}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Référence</p>
                  <p className="font-semibold text-foreground">{selectedPatient.reference}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-2">Score de risque</p>
              <p className="text-3xl font-bold text-foreground mb-3">{selectedPatient.riskScore}</p>
              <RiskBadge level={selectedPatient.riskLevel} size="lg" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - X-ray and Detections */}
          <div className="lg:col-span-2">
            <XrayViewer detections={mockCariesDetection} />
          </div>

          {/* Right Column - Info and Predictions */}
          <div className="space-y-6">
            <PatientInfoCard patient={selectedPatient} />
            <RiskPredictionCard predictions={mockRiskPredictions} />
          </div>
        </div>
      </div>
    </div>
  );
}
