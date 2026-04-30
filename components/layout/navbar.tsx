'use client';

import { useAppContext } from '@/lib/context';
import { useTheme } from '@/components/theme-provider';
import { LogOut, Home, User, LayoutDashboard, Moon, Sun, Settings, MessageCircle, Users, Gift, Gamepad2, ScanSearch } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

function readStoredUser() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem('dentai-user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}


export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentPage, user, selectedPatient, setUser, setSelectedPatient } = useAppContext();
  const { resolvedTheme, setTheme } = useTheme();
  const storedUser = readStoredUser();
  const activeUser = user || storedUser;

  if (pathname === '/login' || pathname === '/') {
    return null;
  }

  const isPatient = activeUser?.role === 'Patient' || !activeUser;
  const isKid = !!activeUser?.isKid;

  const handleLogout = () => {
    setUser(null);
    setSelectedPatient(null);
    router.push('/');
  };

  const handleHome = () => {
    setSelectedPatient(null);
    if (!activeUser) {
      router.push('/login');
      return;
    }

    if (activeUser.isKid) {
      router.push('/kids-zone');
    } else if (isPatient) {
      router.push('/patient-dashboard');
    } else {
      router.push('/home');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-lg border-b border-border/50 px-6 py-3 print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Navigation links */}
          {!isPatient && (
            <div className="flex max-w-full items-center gap-1 overflow-x-auto whitespace-nowrap">
              <button
                onClick={handleHome}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeof window !== 'undefined' && window.location.pathname === '/home'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Home className="w-4 h-4" />
                Tableau de bord
              </button>
              
              <button
                onClick={() => router.push('/network')}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeof window !== 'undefined' && window.location.pathname === '/network'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Users className="w-4 h-4" />
                Liste
              </button>

              <button
                onClick={() => router.push('/messages')}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeof window !== 'undefined' && window.location.pathname === '/messages'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Messages
              </button>

              <button
                onClick={() => router.push('/ai-smile')}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeof window !== 'undefined' && window.location.pathname === '/ai-smile'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <ScanSearch className="w-4 h-4" />
                Analyse IA
              </button>

              {selectedPatient && (
                <button
                  onClick={() => router.push('/patient-detail')}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    typeof window !== 'undefined' && window.location.pathname === '/patient-detail'
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Fiche patient
                </button>
              )}
            </div>
          )}

          {isPatient && (
            <div className="flex max-w-full items-center gap-1 overflow-x-auto whitespace-nowrap">
              <button
                onClick={handleHome}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${(
                  pathname === '/patient-dashboard' ||
                  pathname === '/kids-zone'
                ) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {activeUser?.isKid ? 'Mon univers' : 'Mon espace'}
              </button>

              <button
                onClick={() => router.push('/network')}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeof window !== 'undefined' && window.location.pathname === '/network'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Users className="w-4 h-4" />
                Mon Réseau
              </button>

              <button
                onClick={() => router.push('/messages')}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeof window !== 'undefined' && window.location.pathname === '/messages'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Messages
              </button>

              <button
                onClick={() => router.push('/ai-smile')}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeof window !== 'undefined' && window.location.pathname === '/ai-smile'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <ScanSearch className="w-4 h-4" />
                Analyse IA
              </button>

              {isKid && (
                <button
                  onClick={() => router.push('/kids-zone/rewards')}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    typeof window !== 'undefined' && window.location.pathname === '/kids-zone/rewards'
                      ? 'bg-amber-100 text-amber-800'
                      : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50'
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  Redeem mes étoiles
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right side: user info + logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            title="Basculer thème"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="hidden sm:block text-right mr-1">
            <p className="text-sm font-semibold text-foreground leading-tight">{activeUser?.name || 'Utilisateur'}</p>
            <p className="text-xs text-muted-foreground">{activeUser?.role === 'Médecin' ? 'Dentiste' : activeUser?.role || 'Session'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{activeUser?.avatar || 'U'}</span>
          </div>
          <button
            onClick={() => router.push('/ai-config')}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            title="Configuration IA"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            title="Mon Profil"
          >
            <User className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-red-50 transition-all"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
