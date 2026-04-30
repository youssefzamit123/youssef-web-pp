'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/lib/context';
import type { UserRole } from '@/lib/types';
import { ArrowLeft, BriefcaseMedical, UserRound, Mail } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';


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

type LoginErrorCode = 'missing_email' | 'missing_password' | 'pending_approval' | 'user_not_found' | 'wrong_password' | 'server_error';

const loginErrorCopy: Record<LoginErrorCode, { title: string; detail: string }> = {
  missing_email: {
    title: 'Email manquant',
    detail: 'Entrez votre adresse email pour continuer.',
  },
  missing_password: {
    title: 'Mot de passe manquant',
    detail: 'Saisissez votre mot de passe exact.',
  },
  pending_approval: {
    title: 'Compte en attente',
    detail: 'Votre compte dentiste n’est pas encore validé par un administrateur.',
  },
  user_not_found: {
    title: 'Compte introuvable',
    detail: 'Vérifiez l’adresse email ou créez un compte avec cette adresse.',
  },
  wrong_password: {
    title: 'Mot de passe incorrect',
    detail: 'Le compte existe, mais le mot de passe saisi ne correspond pas.',
  },
  server_error: {
    title: 'Erreur serveur',
    detail: 'Le serveur n’a pas pu traiter la demande pour le moment.',
  },
};

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAppContext();
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [relations, setRelations] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [resetVerificationToken, setResetVerificationToken] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'info' | 'error' | 'success'>('info');

  const showMessage = (title: string, detail = '', type: 'info' | 'error' | 'success' = 'info') => {
    setMessage(detail ? `${title}|||${detail}` : title);
    setMessageType(type);
  };

  useEffect(() => {
    const requestedMode = searchParams.get('mode');
    if (requestedMode === 'login' || requestedMode === 'signup') {
      setMode(requestedMode);
    }
  }, [searchParams]);

  const isSubmitDisabled =
    mode === 'signup' ? !selectedRole : !email.trim() || !password.trim();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('info');
    if (!email || !password) {
      showMessage('Champs requis', 'Veuillez fournir un email et un mot de passe.', 'error');
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
          password
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorCode = (data?.errorCode as LoginErrorCode | undefined) || 'server_error';
        const copy = loginErrorCopy[errorCode] || loginErrorCopy.server_error;
        showMessage(copy.title, data?.error || copy.detail, 'error');
        return;
      }

      const user = data.user;
      setUser(user);

      if (user.role === 'Admin') {
        router.push('/admin-dashboard');
      } else if (user.role === 'Patient' && user.isKid) {
        router.push('/kids-zone');
      } else if (user.role === 'Patient') {
        router.push('/patient-dashboard');
      } else {
        router.push('/home');
      }
    } catch {
      showMessage(loginErrorCopy.server_error.title, loginErrorCopy.server_error.detail, 'error');
    }
  };

  const handleSendResetCode = async () => {
    setMessage('');
    setMessageType('info');

    if (!email.trim()) {
      showMessage('Email requis', 'Saisissez d’abord l’adresse email du compte à récupérer.', 'error');
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
          purpose: 'reset',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        showMessage('Impossible d’envoyer le code', data?.error || 'Vérifiez l’adresse email saisie.', 'error');
        return;
      }

      setResetVerificationToken(data?.verificationToken || '');
      setShowForgotPassword(true);
      showMessage('Code envoyé', 'Un code de réinitialisation a été envoyé à cette adresse.', 'success');
    } catch {
      showMessage('Erreur réseau', 'Impossible de joindre le service d’email pour le moment.', 'error');
    }
  };

  const handleResetPassword = async () => {
    setMessage('');
    setMessageType('info');

    if (!email.trim() || !resetCode.trim() || !resetVerificationToken || !resetNewPassword.trim()) {
      showMessage('Champs requis', 'Email, code et nouveau mot de passe sont obligatoires.', 'error');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      showMessage('Mots de passe différents', 'La confirmation ne correspond pas au nouveau mot de passe.', 'error');
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: resetCode,
          verificationToken: resetVerificationToken,
          newPassword: resetNewPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        showMessage('Réinitialisation impossible', data?.error || 'Le code ou le lien de vérification est invalide.', 'error');
        return;
      }

      setPassword('');
      setResetCode('');
      setResetVerificationToken('');
      setResetNewPassword('');
      setResetConfirmPassword('');
      setShowForgotPassword(false);
      setMessage(data?.message || 'Mot de passe réinitialisé avec succès.');
      setMessageType('success');
      setMode('login');
    } catch {
      showMessage('Erreur réseau', 'La réinitialisation n’a pas pu être envoyée au serveur.', 'error');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('info');

    if (!selectedRole) {
      setMessage('Veuillez sélectionner un rôle.');
      setMessageType('error');
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
        setMessageType('error');
        return;
      }

      setVerificationToken(data?.verificationToken || '');
      setPendingVerification(true);
      setMessage('Code envoyé par email. Entrez-le pour activer votre compte.');
      setMessageType('success');
    } catch {
      setMessage('Impossible de contacter le serveur de vérification.');
      setMessageType('error');
    }
  };

  const handleVerifyCode = async () => {
    setMessage('');
    setMessageType('info');

    if (!email || !verificationCode || !verificationToken) {
      setMessage('Email et code requis pour vérifier le compte.');
      setMessageType('error');
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
        setMessageType('error');
        return;
      }

      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: selectedRole,
          prenom,
          nom,
          telephone,
          dateNaissance,
          localisation,
          relations,
        }),
      });

      const registerData = await registerResponse.json();
      if (!registerResponse.ok) {
        setMessage(registerData?.error || 'Inscription échouée.');
        setMessageType('error');
        return;
      }

      // If the registration is a doctor request that requires admin approval,
      // do not sign the user in. Show a clear message and stop.
      if (registerData.pendingApproval) {
        setMessage(registerData.message || "Veuillez attendre que l'administrateur accepte votre demande.");
        setMessageType('info');
        setPendingVerification(false);
        return;
      }

      setUser(registerData.user);

      if (selectedRole === 'Patient' && registerData.user?.isKid) {
        router.push('/kids-zone');
      } else if (selectedRole === 'Patient') {
        router.push('/patient-dashboard');
      } else {
        router.push('/home');
      }
    } catch {
      setMessage('Erreur de vérification. Réessayez.');
      setMessageType('error');
    }
  };

  const handleResendCode = async () => {
    setMessage('');
    setMessageType('info');

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
        setMessageType('error');
        return;
      }

      setVerificationToken(data?.verificationToken || '');
      setMessage('Nouveau code envoyé.');
      setMessageType('success');
    } catch {
      setMessage('Erreur réseau pendant le renvoi du code.');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/50 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to landing */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </button>

        <div className="bg-card text-card-foreground rounded-2xl border border-border/50 shadow-xl shadow-black/10 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
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
            {mode === 'signup' && (
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
            )}

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

                <div>
                  <label htmlFor="telephone" className="block text-sm font-semibold text-foreground mb-2">
                    Numéro de téléphone
                  </label>
                  <input
                    id="telephone"
                    type="tel"
                    value={telephone}
                    onChange={e => setTelephone(e.target.value)}
                    placeholder="+216 XX XXX XXX"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
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
              {mode === 'login' && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setMessage('');
                      setMessageType('info');
                    }}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}
            </div>

            {mode === 'login' && showForgotPassword && (
              <div className="space-y-4 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Réinitialiser le mot de passe</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Un code est envoyé à l’adresse email saisie ci-dessus.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleSendResetCode}
                    className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                  >
                    Envoyer le code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetCode('');
                      setResetVerificationToken('');
                      setResetNewPassword('');
                      setResetConfirmPassword('');
                    }}
                    className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
                  >
                    Fermer
                  </button>
                </div>

                {resetVerificationToken && (
                  <div className="space-y-3 rounded-xl border border-border/60 bg-card/70 p-3">
                    <div>
                      <label htmlFor="resetCode" className="block text-sm font-semibold text-foreground mb-2">
                        Code reçu par email
                      </label>
                      <input
                        id="resetCode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={resetCode}
                        onChange={e => setResetCode(e.target.value)}
                        placeholder="123456"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="resetNewPassword" className="block text-sm font-semibold text-foreground mb-2">
                        Nouveau mot de passe
                      </label>
                      <input
                        id="resetNewPassword"
                        type="password"
                        value={resetNewPassword}
                        onChange={e => setResetNewPassword(e.target.value)}
                        placeholder="Nouveau mot de passe"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="resetConfirmPassword" className="block text-sm font-semibold text-foreground mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        id="resetConfirmPassword"
                        type="password"
                        value={resetConfirmPassword}
                        onChange={e => setResetConfirmPassword(e.target.value)}
                        placeholder="Confirmez le mot de passe"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-500"
                    >
                      Réinitialiser le mot de passe
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full font-bold py-3 rounded-xl transition-all text-base ${
                !isSubmitDisabled
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

            {message && (() => {
              const [title, detail] = message.includes('|||') ? message.split('|||') : [message, ''];

              return (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm text-center ${
                    messageType === 'error'
                      ? 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'
                      : messageType === 'success'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'border-primary/20 bg-primary/5 text-primary'
                  }`}
                >
                  <p className="font-semibold">{title}</p>
                  {detail && <p className="mt-1 text-xs opacity-90">{detail}</p>}
                </div>
              );
            })()}
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
