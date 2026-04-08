'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/lib/context';
import { StatCard } from '@/components/common/stat-card';
import { RiskBadge } from '@/components/common/risk-badge';
import { PatientsTable } from './home/patients-table';
import { UploadZone } from './home/upload-zone';
import { ActivityFeed } from './home/activity-feed';
import { Users, Zap, AlertCircle, Target } from 'lucide-react';
import type { ActivityFeedItem, Patient } from '@/lib/types';

export function HomePage() {
  const { user } = useAppContext();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/bootstrap');
        const data = await response.json();
        setPatients(data?.patients || []);
        setActivityFeed(data?.activityFeed || []);
      } catch {
        setPatients([]);
        setActivityFeed([]);
      }
    };

    loadData();
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const highRiskCount = patients.filter(p => p.riskLevel === 'Élevé').length;
  const totalPatients = patients.length;
  const analysisCount = patients.length * 3;
  const aiAccuracy = 94;

  return (
    <div className="min-h-screen bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
            Bonjour, {user?.name?.split(' ').slice(0, 2).join(' ') || 'Dr.'}
          </h1>
          <p className="text-sm text-muted-foreground capitalize">{dateStr}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Patients"
            value={totalPatients}
            icon={<Users className="w-6 h-6" />}
          />
          <StatCard
            label="Analyses IA"
            value={analysisCount}
            icon={<Zap className="w-6 h-6" />}
          />
          <StatCard
            label="Risque élevé"
            value={highRiskCount}
            badge={<RiskBadge level="Élevé" size="sm" />}
            icon={<AlertCircle className="w-6 h-6" />}
          />
          <StatCard
            label="Précision IA"
            value={`${aiAccuracy}%`}
            icon={<Target className="w-6 h-6" />}
            highlight
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Patients récents</h2>
              <PatientsTable patients={patients} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <UploadZone />
            <ActivityFeed items={activityFeed} />
          </div>
        </div>

      </div>
    </div>
  );
}
