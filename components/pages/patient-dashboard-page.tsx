'use client';

import { useAppContext } from '@/lib/context';
import { mockPatients, mockAppointments, mockRiskPredictions } from '@/lib/mock-data';
import {
  Calendar,
  FileText,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Phone,
} from 'lucide-react';

const statusColors = {
  'confirmé': 'bg-green-50 text-green-700 border-green-200',
  'en attente': 'bg-amber-50 text-amber-700 border-amber-200',
  'annulé': 'bg-red-50 text-red-700 border-red-200',
};

const statusIcons = {
  'confirmé': <CheckCircle className="w-4 h-4" />,
  'en attente': <Clock className="w-4 h-4" />,
  'annulé': <AlertCircle className="w-4 h-4" />,
};

export function PatientDashboardPage() {
  const { user } = useAppContext();

  const patient = mockPatients.find(p => p.name === user?.name) || mockPatients[0];

  const riskColor =
    patient.riskLevel === 'Élevé'
      ? 'text-red-600'
      : patient.riskLevel === 'Modéré'
        ? 'text-amber-600'
        : 'text-green-600';

  const riskBg =
    patient.riskLevel === 'Élevé'
      ? 'bg-red-50 border-red-200'
      : patient.riskLevel === 'Modéré'
        ? 'bg-amber-50 border-amber-200'
        : 'bg-green-50 border-green-200';

  return (
    <div className="min-h-screen bg-secondary/50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative">
            <p className="text-white/70 text-sm mb-1">Bienvenue sur votre espace</p>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">{patient.name}</h1>
            <p className="text-white/80 text-sm">
              Référence: {patient.reference} &middot; CIN: {patient.cin}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-border/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Score de risque</p>
            <p className={`text-2xl font-bold ${riskColor}`}>{patient.riskScore}/100</p>
          </div>
          <div className="bg-white rounded-xl border border-border/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Prochain RDV</p>
            <p className="text-lg font-bold text-foreground">{mockAppointments[0].date}</p>
          </div>
          <div className="bg-white rounded-xl border border-border/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Dernière visite</p>
            <p className="text-lg font-bold text-foreground">{patient.lastVisit}</p>
          </div>
          <div className="bg-white rounded-xl border border-border/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Analyses IA</p>
            <p className="text-lg font-bold text-foreground">3 rapports</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Appointments + Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointments */}
            <div className="bg-white rounded-xl border border-border/50 p-6">
              <h2 className="text-lg font-bold text-foreground mb-5">Mes rendez-vous</h2>
              <div className="space-y-3">
                {mockAppointments.map(apt => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="w-14 h-14 bg-primary/5 rounded-xl flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {new Date(apt.date).toLocaleDateString('fr-FR', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {new Date(apt.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{apt.type}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {apt.time} &middot; {apt.doctor}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColors[apt.status]}`}
                    >
                      {statusIcons[apt.status]}
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="bg-white rounded-xl border border-border/50 p-6">
              <h2 className="text-lg font-bold text-foreground mb-5">
                Mon analyse de risque
              </h2>
              <div className={`p-4 rounded-xl border mb-6 ${riskBg}`}>
                <div className="flex items-center gap-3">
                  <AlertCircle className={`w-5 h-5 ${riskColor}`} />
                  <div>
                    <p className={`font-semibold text-sm ${riskColor}`}>
                      Niveau de risque : {patient.riskLevel}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Score global : {patient.riskScore}/100
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {mockRiskPredictions.map((pred, idx) => {
                  const barColor =
                    pred.color === 'high'
                      ? 'bg-red-500'
                      : pred.color === 'medium'
                        ? 'bg-amber-500'
                        : 'bg-green-500';
                  const labelColor =
                    pred.color === 'high'
                      ? 'text-red-700 bg-red-50'
                      : pred.color === 'medium'
                        ? 'text-amber-700 bg-amber-50'
                        : 'text-green-700 bg-green-50';
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">{pred.metric}</p>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${labelColor}`}
                        >
                          {pred.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${barColor}`}
                          style={{ width: `${pred.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Personal Info + Doctor */}
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-xl border border-border/50 p-6">
              <h2 className="text-lg font-bold text-foreground mb-5">Mes informations</h2>
              <div className="space-y-4">
                {[
                  { label: 'Date de naissance', value: patient.dateOfBirth || '-' },
                  { label: 'Âge', value: `${patient.age} ans` },
                  { label: 'Genre', value: patient.gender === 'M' ? 'Homme' : 'Femme' },
                  { label: 'Téléphone', value: patient.phone || '-' },
                  { label: 'Assurance', value: patient.insurance || '-' },
                  {
                    label: 'Historique médical',
                    value: patient.medicalHistory || 'Aucun',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground text-right">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* My Doctor */}
            <div className="bg-white rounded-xl border border-border/50 p-6">
              <h2 className="text-lg font-bold text-foreground mb-5">Mon médecin</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                  <span className="text-base font-bold text-primary">RB</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Dr. Rami Benayed</p>
                  <p className="text-xs text-muted-foreground">Chirurgien-dentiste</p>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/15 transition-colors text-sm">
                <Phone className="w-4 h-4" />
                Contacter
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-border/50 p-6">
              <h2 className="text-lg font-bold text-foreground mb-5">Actions rapides</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors text-left">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Prendre un RDV</p>
                    <p className="text-xs text-muted-foreground">Planifier une consultation</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors text-left">
                  <FileText className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Mes rapports</p>
                    <p className="text-xs text-muted-foreground">Voir les analyses IA</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
