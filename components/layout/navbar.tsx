'use client';

import { useAppContext } from '@/lib/context';
import { useTheme } from '@/components/theme-provider';
import { LogOut, Home, User, LayoutDashboard, Moon, Sun, Settings, MessageCircle, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';


export function Navbar() {
  const router = useRouter();
  const { currentPage, user, selectedPatient, setUser, setSelectedPatient } = useAppContext();
  const { resolvedTheme, setTheme } = useTheme();

  if (!user || (typeof window !== 'undefined' && (window.location.pathname === '/login' || window.location.pathname === '/'))) {
    return null;
  }

  const isPatient = user?.role === 'Patient';

  const handleLogout = () => {
    setUser(null);
    setSelectedPatient(null);
    router.push('/');
  };

  const handleHome = () => {
    setSelectedPatient(null);
    if (user?.isKid) {
      router.push('/kids-zone');
    } else if (isPatient) {
      router.push('/patient-dashboard');
    } else {
      router.push('/home');
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 py-3 print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <button onClick={handleHome} className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">D</span>
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">
              Dent<span className="text-primary">AI</span>
            </span>
          </button>

          {/* Navigation links */}
          {!isPatient && (
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={handleHome}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeof window !== 'undefined' && window.location.pathname === '/messages'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Messages
              </button>

              {selectedPatient && (
                <button
                  onClick={() => router.push('/patient-detail')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={handleHome}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeof window !== 'undefined' && window.location.pathname === '/patient-dashboard' || typeof window !== 'undefined' && window.location.pathname === '/kids-zone'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {user?.isKid ? 'Mon univers' : 'Mon espace'}
              </button>

              <button
                onClick={() => router.push('/network')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeof window !== 'undefined' && window.location.pathname === '/messages'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Messages
              </button>
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
            <p className="text-sm font-semibold text-foreground leading-tight">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.role === 'Médecin' ? 'Dentiste' : user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{user?.avatar || 'U'}</span>
          </div>
          <button
            onClick={() => router.push('/profile')}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            title="Mon Profil"
          >
            <Settings className="w-4 h-4" />
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
