'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@/lib/context';
import { ActivityFeedItem } from '@/lib/types';
import { Sparkles, FileText, Clock, ShieldCheck } from 'lucide-react';

export function KidsZonePage() {
  const { user } = useAppContext();
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch('/api/activity-feed');
        const data = await response.json();
        setActivityFeed(Array.isArray(data?.activityFeed) ? data.activityFeed : []);
      } catch {
        setActivityFeed([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, []);

  const patientHistory = useMemo(() => {
    const email = user?.email?.toLowerCase();
    if (!email) {
      return [];
    }

    return activityFeed.filter(item => (item.patientEmail || '').toLowerCase() === email);
  }, [activityFeed, user?.email]);

  const formatTimestamp = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#fde68a_0%,transparent_40%),radial-gradient(circle_at_80%_10%,#93c5fd_0%,transparent_35%),radial-gradient(circle_at_50%_80%,#f9a8d4_0%,transparent_35%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(217,119,6,0.20)_0%,transparent_42%),radial-gradient(circle_at_80%_10%,rgba(30,58,138,0.34)_0%,transparent_38%),radial-gradient(circle_at_50%_80%,rgba(157,23,77,0.22)_0%,transparent_38%)] px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-border/70 bg-card/85 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-1 text-sm font-semibold text-foreground">
                <Sparkles className="w-4 h-4" />
                Zone Kids
              </p>
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-foreground">Historique du patient</h1>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  L’historique des visites et des mises à jour du dentiste apparaît ici.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Patient</p>
              <p className="mt-2 text-lg font-bold text-foreground">{user?.name || 'Utilisateur connecté'}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Focus</p>
              <p className="mt-2 text-lg font-bold text-foreground">Historique</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Historique</p>
              <p className="mt-2 text-lg font-bold text-foreground">{patientHistory.length} événements</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border/70 bg-card/90 p-6 md:p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                Historique
              </h2>
              <p className="text-sm text-muted-foreground mt-2">Les mises à jour du dentiste et les analyses liées au dossier.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="w-4 h-4" />
              Synchronisé avec le dossier
            </div>
          </div>

          {loadingHistory ? (
            <div className="rounded-3xl border border-border/60 bg-secondary/20 p-8 text-center text-muted-foreground">
              Chargement de l'historique...
            </div>
          ) : patientHistory.length === 0 ? (
            <div className="rounded-3xl border border-border/60 bg-secondary/20 p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucune visite ou mise à jour n’est encore enregistrée.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientHistory.map(item => {
                const label = item.type === 'appointment' ? 'Visite' : 'Mise à jour';

                return (
                  <article key={item.id} className="rounded-3xl border border-border/60 bg-secondary/20 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-foreground">{label}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <time className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(item.timestamp)}
                      </time>
                    </div>

                    {(item.date || item.time || item.location) && (
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {item.date && <span className="rounded-full bg-background/70 px-2.5 py-1">{item.date}</span>}
                        {item.time && <span className="rounded-full bg-background/70 px-2.5 py-1">{item.time}</span>}
                        {item.location && <span className="rounded-full bg-background/70 px-2.5 py-1">{item.location}</span>}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
