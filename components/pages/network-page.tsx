'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Search, UserPlus, Check, X, MessageCircle, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MOCK_PATIENTS = [
  { id: 1, name: 'Alice Dubois', age: 34, location: 'Paris', status: 'pending' },
  { id: 2, name: 'Marc Lemaire', age: 45, location: 'Lyon', status: 'none' },
];

const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. Sarah Martin', specialty: 'Orthodontiste', location: 'Paris', status: 'pending_my_approval' },
  { id: 2, name: 'Dr. Jean Dupont', specialty: 'Chirurgien-dentiste', location: 'Lyon', status: 'none' },
];

export function NetworkPage() {
  const { user } = useAppContext();
  const router = useRouter();
  const [search, setSearch] = useState('');

  if (!user) {
    router.push('/');
    return null;
  }

  const isPatient = user.role === 'Patient';
  const directory = isPatient ? MOCK_DOCTORS : MOCK_PATIENTS;

  const handleAction = (action: string, id: number) => {
    alert(`Action ${action} sur l'ID ${id} (Connecté à l'API prochainement)`);
  };

  return (
    <div className="min-h-screen bg-secondary/50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isPatient ? 'Mon Réseau Médical' : 'Annuaire des Patients'}
          </h1>
          <p className="text-muted-foreground">
            {isPatient 
              ? 'Gérez vos professionnels de santé et les accès à votre dossier.' 
              : 'Recherchez de nouveaux patients et envoyez-leur une demande d\'accès à leur dossier.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={isPatient ? "Rechercher un médecin par nom ou ville..." : "Rechercher un patient par nom ou téléphone..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-card shadow-sm focus:ring-2 focus:ring-primary/20 text-foreground"
          />
        </div>

        {/* Directory List */}
        <div className="grid gap-4">
          {directory.map((person) => (
            <div key={person.id} className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0">
                  {person.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{person.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    {/* @ts-ignore */}
                    {person.specialty || `${person.age} ans`} • {person.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {person.status === 'none' && (
                  <button 
                    onClick={() => handleAction('invite', person.id)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Ajouter
                  </button>
                )}
                {person.status === 'pending' && (
                  <span className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-sm font-medium border border-orange-200">
                    En attente d'acceptation
                  </span>
                )}
                {person.status === 'pending_my_approval' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction('accept', person.id)}
                      className="flex items-center justify-center w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                      title="Accepter l'accès"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleAction('decline', person.id)}
                      className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                      title="Refuser"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <button 
                  onClick={() => router.push('/messages')}
                  className="flex items-center justify-center w-10 h-10 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-all"
                  title="Envoyer un message"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}