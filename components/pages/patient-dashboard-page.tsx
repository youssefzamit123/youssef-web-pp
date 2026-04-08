'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@/lib/context';
import {
  Calendar,
  FileText,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Phone,
  CreditCard,
  Award,
  Gift,
} from 'lucide-react';
import type { Appointment, Patient, RiskPrediction } from '@/lib/types';

type RewardItem = {
  id: string;
  title: string;
  cost: number;
  description: string;
};

type LoyaltyProfile = {
  patientEmail: string;
  role: 'kid' | 'adult';
  points: number;
  minutesSpent: number;
  collectedRewards: string[];
};

const statusColors = {
  'confirmé': 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/30',
  'en attente': 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  'annulé': 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30',
};

const statusIcons = {
  'confirmé': <CheckCircle className="w-4 h-4" />,
  'en attente': <Clock className="w-4 h-4" />,
  'annulé': <AlertCircle className="w-4 h-4" />,
};

export function PatientDashboardPage() {
  const { user } = useAppContext();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyProfile | null>(null);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [loyaltyMessage, setLoyaltyMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bootstrapRes, appointmentsRes] = await Promise.all([
          fetch('/api/data/bootstrap'),
          fetch(`/api/appointments?patientEmail=${encodeURIComponent(user?.email || '')}`),
        ]);

        const bootstrapData = await bootstrapRes.json();
        const appointmentsData = await appointmentsRes.json();

        setPatients(bootstrapData?.patients || []);
        setAppointments(appointmentsData?.appointments || []);
      } catch {
        setPatients([]);
        setAppointments([]);
      }
    };

    loadData();
  }, [user?.email]);

  useEffect(() => {
    const loadLoyalty = async () => {
      if (!user?.email) return;

      try {
        const response = await fetch(`/api/loyalty?patientEmail=${encodeURIComponent(user.email)}`);
        const data = await response.json();
        if (response.ok) {
          setLoyalty(data.profile || null);
          setRewards(Array.isArray(data.availableRewards) ? data.availableRewards : []);
        }
      } catch {
        setLoyalty(null);
      }
    };

    loadLoyalty();
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email) return;

    const timer = setInterval(async () => {
      try {
        const response = await fetch('/api/loyalty', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientEmail: user.email,
            action: 'heartbeat',
            minutes: 1,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setLoyalty(data.profile || null);
          setRewards(Array.isArray(data.availableRewards) ? data.availableRewards : []);
        }
      } catch {
        // silent
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [user?.email]);

  const patient =
    patients.find(p => p.patientEmail?.toLowerCase() === user?.email?.toLowerCase()) ||
    patients.find(p => p.name === user?.name) ||
    patients[0];

  const riskPredictions: RiskPrediction[] = useMemo(
    () => [
      { metric: 'Carie avancée', percentage: patient?.riskScore || 0, color: 'high' },
      {
        metric: 'Risque parodontal',
        percentage: Math.max(10, Math.min(95, Math.round((patient?.riskScore || 30) * 0.7))),
        color: 'medium',
      },
      {
        metric: 'Hypersensibilité',
        percentage: Math.max(5, Math.min(90, Math.round((patient?.riskScore || 20) * 0.45))),
        color: 'low',
      },
    ],
    [patient?.riskScore]
  );

  if (!patient) {
    return (
      <div className="min-h-screen bg-secondary/50 p-8">
        <p className="text-muted-foreground">Aucun dossier patient trouvé.</p>
      </div>
    );
  }

  const riskColor =
    patient.riskLevel === 'Élevé'
      ? 'text-red-700 dark:text-red-300'
      : patient.riskLevel === 'Modéré'
        ? 'text-amber-700 dark:text-amber-300'
        : 'text-green-700 dark:text-green-300';

  const riskBg =
    patient.riskLevel === 'Élevé'
      ? 'bg-red-500/10 border-red-500/30'
      : patient.riskLevel === 'Modéré'
        ? 'bg-amber-500/10 border-amber-500/30'
        : 'bg-green-500/10 border-green-500/30';

  const fidelityTier =
    (loyalty?.points || 0) >= 200
      ? 'Or'
      : (loyalty?.points || 0) >= 100
        ? 'Argent'
        : 'Bronze';

  const cardColor =
    fidelityTier === 'Or'
      ? 'from-amber-500 to-yellow-400'
      : fidelityTier === 'Argent'
        ? 'from-slate-400 to-slate-300'
        : 'from-orange-600 to-orange-400';

  const handleCollectReward = async (rewardId: string) => {
    if (!user?.email) return;

    try {
      const response = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientEmail: user.email,
          action: 'collect',
          rewardId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setLoyaltyMessage(data?.error || 'Impossible de récupérer cette récompense.');
        return;
      }

      setLoyalty(data.profile || null);
      setRewards(Array.isArray(data.availableRewards) ? data.availableRewards : []);
      setLoyaltyMessage(`Récompense fidélité récupérée: ${data.reward?.title || 'cadeau'}.`);
    } catch {
      setLoyaltyMessage('Erreur réseau fidélité.');
    }
  };

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
          <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Score de risque</p>
            <p className={`text-2xl font-bold ${riskColor}`}>{patient.riskScore}/100</p>
          </div>
          <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Prochain RDV</p>
            <p className="text-lg font-bold text-foreground">{appointments[0]?.date || '-'}</p>
          </div>
          <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Dernière visite</p>
            <p className="text-lg font-bold text-foreground">{patient.lastVisit}</p>
          </div>
          <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-5 hover:shadow-md transition-shadow">
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
            <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-6">
              <h2 className="text-lg font-bold text-foreground mb-5">Mes rendez-vous</h2>
              <div className="space-y-3">
                {appointments.map(apt => (
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
            <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-6">
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
                {riskPredictions.map((pred, idx) => {
                  const barColor =
                    pred.color === 'high'
                      ? 'bg-red-500'
                      : pred.color === 'medium'
                        ? 'bg-amber-500'
                        : 'bg-green-500';
                  const labelColor =
                    pred.color === 'high'
                      ? 'text-red-700 dark:text-red-300 bg-red-500/10'
                      : pred.color === 'medium'
                        ? 'text-amber-700 dark:text-amber-300 bg-amber-500/10'
                        : 'text-green-700 dark:text-green-300 bg-green-500/10';
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
            <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-6">
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
            <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-6">
              <h2 className="text-lg font-bold text-foreground mb-5">Mon dentiste</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                  <span className="text-base font-bold text-primary">
                    {(patient.doctor || 'NA')
                      .split(' ')
                      .slice(0, 2)
                      .map(part => part[0])
                      .join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{patient.doctor || 'Non assigné'}</p>
                  <p className="text-xs text-muted-foreground">Chirurgien-dentiste</p>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/15 transition-colors text-sm">
                <Phone className="w-4 h-4" />
                Contacter
              </button>
            </div>

            {patient.age >= 18 && (
              <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-6">
                <h2 className="text-lg font-bold text-foreground mb-5">Carte fidélité</h2>

                <div className={`rounded-2xl bg-gradient-to-r ${cardColor} p-4 text-white mb-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/80">DentAI fidélité</p>
                      <p className="text-lg font-bold">Niveau {fidelityTier}</p>
                    </div>
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <p className="text-sm mt-3">Points: {loyalty?.points || 0}</p>
                  <p className="text-xs text-white/80 mt-1">Temps cumulé: {loyalty?.minutesSpent || 0} min</p>
                </div>

                <div className="rounded-xl border border-border bg-background p-3 mb-4">
                  <p className="text-xs text-muted-foreground">Récompenses fidélité disponibles</p>
                  <div className="mt-2 space-y-2">
                    {rewards.map(reward => {
                      const alreadyCollected = loyalty?.collectedRewards?.includes(reward.id);
                      const canCollect = !alreadyCollected && (loyalty?.points || 0) >= reward.cost;

                      return (
                        <div key={reward.id} className="rounded-lg border border-border p-2">
                          <p className="text-sm font-semibold text-foreground">{reward.title}</p>
                          <p className="text-xs text-muted-foreground">{reward.description}</p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="text-xs text-primary font-semibold">{reward.cost} pts</span>
                            <button
                              type="button"
                              onClick={() => handleCollectReward(reward.id)}
                              disabled={!canCollect}
                              className="text-xs px-2 py-1 rounded-md bg-primary text-primary-foreground disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed"
                            >
                              {alreadyCollected ? 'Pris' : canCollect ? 'Récupérer' : 'Bloqué'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Award className="w-4 h-4" />
                  Gardez cette page ouverte pour gagner des points automatiquement.
                </div>
                {loyaltyMessage && (
                  <p className="mt-3 text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    {loyaltyMessage}
                  </p>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-6">
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
