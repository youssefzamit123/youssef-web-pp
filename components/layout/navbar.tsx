'use client';

import { useAppContext } from '@/lib/context';
import { useTheme } from '@/components/theme-provider';
import { LogOut, Home, User, LayoutDashboard, Moon, Sun } from 'lucide-react';

export function Navbar() {
  const { currentPage, user, selectedPatient, setCurrentPage, setUser, setSelectedPatient } =
    useAppContext();
  const { resolvedTheme, setTheme } = useTheme();

  if (currentPage === 'login' || currentPage === 'landing') return null;

  const isPatient = user?.role === 'Patient';

  const handleLogout = () => {
    setUser(null);
    setSelectedPatient(null);
    setCurrentPage('landing');
  };

  const handleHome = () => {
    setSelectedPatient(null);
    if (user?.isKid) {
      setCurrentPage('kids-zone');
    } else if (isPatient) {
      setCurrentPage('patient-dashboard');
    } else {
      setCurrentPage('home');
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 py-3">
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
                  currentPage === 'home'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Home className="w-4 h-4" />
                Tableau de bord
              </button>
              <button
                onClick={() => selectedPatient && setCurrentPage('patient-detail')}
                disabled={!selectedPatient}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 'patient-detail'
                    ? 'bg-primary/10 text-primary'
                    : !selectedPatient
                      ? 'text-muted-foreground/40 cursor-not-allowed'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <User className="w-4 h-4" />
                Fiche patient
              </button>
            </div>
          )}

          {isPatient && (
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={handleHome}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 'patient-dashboard' || currentPage === 'kids-zone'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {user?.isKid ? 'Mon univers' : 'Mon espace'}
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
