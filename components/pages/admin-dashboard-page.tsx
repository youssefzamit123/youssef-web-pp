'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/lib/context';
import { Check, X, Loader2, UserRound, ArrowLeft } from 'lucide-react';
import type { DoctorAccountRequest } from '@/lib/types';
import { Navbar } from '@/components/layout/navbar';
import { useRouter } from 'next/navigation';


export function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAppContext();
  const [requests, setRequests] = useState<DoctorAccountRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/requests');
      const data = await res.json();
      if (data.requests) {
        setRequests(data.requests);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        setRequests(requests.filter(r => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!user || user.role !== 'Admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Accès refusé</h2>
        <p className="text-muted-foreground mb-8">Seuls les administrateurs peuvent accéder à cette page.</p>
        <button onClick={() => router.push('/')} className="px-4 py-2 bg-primary text-white rounded-lg">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord Admin</h1>
          <p className="text-muted-foreground">Gérez les demandes d'accès des praticiens à la plateforme.</p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/20">
            <h2 className="text-xl font-semibold">Demandes de Création de Compte (Médecins)</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                À jour ! Aucune demande en attente.
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map(req => (
                  <div key={req.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background rounded-lg border border-border/50 hover:shadow-md transition-shadow gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <UserRound className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{req.name}</h3>
                        <p className="text-sm text-primary font-medium">{req.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">Requête générée le : {new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAction(req.id, 'reject')}
                        className="flex items-center gap-2 px-4 py-2 border border-destructive/20 text-destructive hover:bg-destructive hover:text-white rounded-md transition-colors text-sm font-medium"
                      >
                        <X className="w-4 h-4" />
                        Rejeter
                      </button>
                      <button
                        onClick={() => handleAction(req.id, 'approve')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-md transition-colors text-sm font-medium"
                      >
                        <Check className="w-4 h-4" />
                        Approuver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
