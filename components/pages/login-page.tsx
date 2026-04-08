'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/context';
import type { UserRole } from '@/lib/types';
import { ArrowLeft, BriefcaseMedical, UserRound, Mail } from 'lucide-react';

const roles: { role: UserRole; label: string; icon: React.ReactNode; description: string }[] = [
  {
    role: 'Médecin',
    label: 'Dentiste',
    icon: <BriefcaseMedical className="w-6 h-6" />,
    description: 'Diagnostic et suivi patient',
  },
  {
    role: 'Patient',
    label: 'Patient',
    icon: <UserRound className="w-6 h-6" />,
    description: 'Consulter mon dossier',
  },
];

type AuthMode = 'login' | 'signup';

function getAgeFromBirthDate(dateNaissance: string) {
  if (!dateNaissance) return null;

  const birthDate = new Date(dateNaissance);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
}

export function LoginPage() {
  const { setUser, setCurrentPage } = useAppContext();
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [relations, setRelations] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!email || !selectedRole) {
      setMessage('Veuillez fournir email et rôle.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role: selectedRole,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data?.error || 'Connexion échouée.');
        return;
      }

      const user = data.user;
      setUser(user);

      if (selectedRole === 'Patient' && user.isKid) {
        setCurrentPage('kids-zone');
      } else if (selectedRole === 'Patient') {
        setCurrentPage('patient-dashboard');
      } else {
        setCurrentPage('home');
      }
    } catch {
      setMessage('Impossible de se connecter au serveur.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!selectedRole) {
      setMessage('Veuillez sélectionner un rôle.');
      return;
    }

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          fullName: `${prenom} ${nom}`.trim(),
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data?.error || 'Impossible d\'envoyer le code de vérification.');
        return;
      }

      setVerificationToken(data?.verificationToken || '');
      setPendingVerification(true);
      setMessage('Code envoyé par email. Entrez-le pour activer votre compte.');
    } catch {
      setMessage('Impossible de contacter le serveur de vérification.');
    }
  };

  const handleVerifyCode = async () => {
    setMessage('');

    if (!email || !verificationCode || !verificationToken) {
      setMessage('Email et code requis pour vérifier le compte.');
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
          verificationToken,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data?.error || 'Code invalide.');
        return;
      }

      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role: selectedRole,
          prenom,
          nom,
          dateNaissance,
          localisation,
          relations,
        }),
      });

      const registerData = await registerResponse.json();
      if (!registerResponse.ok) {
        setMessage(registerData?.error || 'Inscription échouée.');
        return;
      }

      setUser(registerData.user);

      if (selectedRole === 'Patient' && registerData.user?.isKid) {
        setCurrentPage('kids-zone');
      } else if (selectedRole === 'Patient') {
        setCurrentPage('patient-dashboard');
      } else {
        setCurrentPage('home');
      }
    } catch {
      setMessage('Erreur de vérification. Réessayez.');
    }
  };

  const handleResendCode = async () => {
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          fullName: `${prenom} ${nom}`.trim(),
          role: selectedRole,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data?.error || 'Impossible de renvoyer le code.');
        return;
      }

      setVerificationToken(data?.verificationToken || '');
      setMessage('Nouveau code envoyé.');
    } catch {
      setMessage('Erreur réseau pendant le renvoi du code.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/50 flex items-center justify-center px-4">
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

        <div className="bg-card text-card-foreground rounded-2xl border border-border/50 shadow-xl shadow-black/10 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              {selectedRole === 'Médecin' ? (
                <BriefcaseMedical className="w-7 h-7 text-white" />
              ) : selectedRole === 'Patient' ? (
                <UserRound className="w-7 h-7 text-white" />
              ) : (
                <span className="text-white text-xl font-bold">D</span>
              )}
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold text-foreground mb-1">
            Bienvenue sur DentAI
          </h1>
          <p className="text-center text-sm text-muted-foreground mb-8">
            Connexion et création de compte sur une seule page
          </p>

          <div className="grid grid-cols-2 bg-secondary/70 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-foreground/70'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-background text-foreground shadow-sm' : 'text-foreground/70'
              }`}
            >
              Créer un compte
            </button>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-5">
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

            {mode === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-semibold text-foreground mb-2">
                      Prénom
                    </label>
                    <input
                      id="prenom"
                      type="text"
                      value={prenom}
                      onChange={e => setPrenom(e.target.value)}
                      placeholder="Prénom"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" className="block text-sm font-semibold text-foreground mb-2">
                      Nom
                    </label>
                    <input
                      id="nom"
                      type="text"
                      value={nom}
                      onChange={e => setNom(e.target.value)}
                      placeholder="Nom"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="dateNaissance"
                      className="block text-sm font-semibold text-foreground mb-2"
                    >
                      Date de naissance
                    </label>
                    <input
                      id="dateNaissance"
                      type="date"
                      value={dateNaissance}
                      onChange={e => setDateNaissance(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="localisation"
                      className="block text-sm font-semibold text-foreground mb-2"
                    >
                      Localisation
                    </label>
                    <input
                      id="localisation"
                      type="text"
                      value={localisation}
                      onChange={e => setLocalisation(e.target.value)}
                      placeholder="Ville / région"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="relations" className="block text-sm font-semibold text-foreground mb-2">
                    {selectedRole === 'Médecin'
                      ? 'Patients suivis (plusieurs)'
                      : selectedRole === 'Patient'
                        ? 'Dentistes référents (plusieurs)'
                        : 'Relations (optionnel)'}
                  </label>
                  <input
                    id="relations"
                    type="text"
                    value={relations}
                    onChange={e => setRelations(e.target.value)}
                    placeholder="Ex: Ali Ben, Leila Hamdi"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Un dentiste peut suivre plusieurs patients, et un patient peut avoir plusieurs dentistes.
                  </p>
                </div>
              </>
            )}

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
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>

            {mode === 'signup' && pendingVerification && (
              <div className="space-y-3 rounded-xl border border-border/60 p-4 bg-secondary/20">
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-semibold text-foreground"
                >
                  Code de vérification (6 chiffres)
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="w-full font-bold py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  Vérifier le code
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="w-full font-semibold py-2 rounded-xl border border-border text-foreground hover:bg-secondary transition-all"
                >
                  Renvoyer le code
                </button>
              </div>
            )}

            <button
              type="button"
              disabled
              className="w-full font-semibold py-3 rounded-xl border border-border text-muted-foreground bg-card/60 cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Continuer avec Google (bientôt)
            </button>

            {message && <p className="text-xs text-primary text-center">{message}</p>}
          </form>

          <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <button className="hover:text-foreground transition-colors">
              Mot de passe oublié ?
            </button>
            <button className="hover:text-foreground transition-colors">
              Contacter le support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
