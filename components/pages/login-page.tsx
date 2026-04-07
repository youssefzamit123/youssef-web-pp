'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { mockUsers } from '@/lib/mock-data';
import type { UserRole } from '@/lib/types';
import { ArrowLeft, Stethoscope, ScanLine, UserRound, ShieldCheck } from 'lucide-react';

const roles: { role: UserRole; label: string; icon: React.ReactNode; description: string }[] = [
  {
    role: 'Médecin',
    label: 'Médecin',
    icon: <Stethoscope className="w-6 h-6" />,
    description: 'Diagnostic et suivi patient',
  },
  {
    role: 'Radiologue',
    label: 'Radiologue',
    icon: <ScanLine className="w-6 h-6" />,
    description: 'Analyse des radiographies',
  },
  {
    role: 'Patient',
    label: 'Patient',
    icon: <UserRound className="w-6 h-6" />,
    description: 'Consulter mon dossier',
  },
  {
    role: 'Admin',
    label: 'Administrateur',
    icon: <ShieldCheck className="w-6 h-6" />,
    description: 'Gestion du système',
  },
];

export function LoginPage() {
  const { setUser, setCurrentPage } = useAppContext();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.role === selectedRole);
    if (user) {
      setUser(user);
      if (selectedRole === 'Patient') {
        setCurrentPage('patient-dashboard');
      } else {
        setCurrentPage('home');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to landing */}
        <button
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </button>

        <div className="bg-white rounded-2xl border border-border/50 shadow-xl shadow-black/5 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-white text-xl font-bold">D</span>
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold text-foreground mb-1">
            Bienvenue sur DentAI
          </h1>
          <p className="text-center text-sm text-muted-foreground mb-8">
            Connectez-vous pour accéder à votre espace
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role selection */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Je suis...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(r => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setSelectedRole(r.role)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedRole === r.role
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                        : 'border-border/50 hover:border-border hover:bg-secondary/50'
                    }`}
                  >
                    <div
                      className={`mb-2 ${
                        selectedRole === r.role ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {r.icon}
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        selectedRole === r.role ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {r.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedRole}
              className={`w-full font-bold py-3 rounded-xl transition-all text-base ${
                selectedRole
                  ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <button className="hover:text-foreground transition-colors">
              Mot de passe oublié ?
            </button>
            <button className="hover:text-foreground transition-colors">
              Contacter l&apos;admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
