'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import { CalendarDays, CircleUserRound, Gamepad2, LayoutDashboard, MessageCircle, Sparkles, Stethoscope, Users, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

function readStoredUser() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem('dentai-user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: Array<'Médecin' | 'Patient' | 'Admin'>;
};

export function WorkspaceSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppContext();
  const storedUser = readStoredUser();
  const activeUser = user || storedUser;

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        label: 'Tableau de bord',
        href: activeUser?.role === 'Patient' ? (activeUser.isKid ? '/kids-zone' : '/patient-dashboard') : '/home',
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        label: 'Calendrier',
        href: '/learn/calendar',
        icon: <CalendarDays className="h-4 w-4" />,
      },
          {
            label: 'Messages',
            href: '/messages',
            icon: <MessageCircle className="h-4 w-4" />,
          },
          {
            label: 'Réseau',
            href: '/network',
            icon: <Users className="h-4 w-4" />,
          },
          {
            label: 'Fiche patient',
            href: '/patient-detail',
            icon: <CircleUserRound className="h-4 w-4" />,
            roles: ['Médecin'],
          },
          {
            label: 'Profil',
            href: '/profile',
            icon: <Stethoscope className="h-4 w-4" />,
          },
    ],
    [activeUser]
  );

  if (!activeUser) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-border/70 bg-background/95 text-foreground backdrop-blur xl:flex xl:flex-col">
      <div className="border-b border-border/70 px-5 py-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-cyan-400 shadow-lg shadow-sky-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-black text-foreground">DentAI Studio</p>
          </div>
        </div>
      </div>

      <div className="border-b border-border/70 px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Connecté comme</p>
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border/70 bg-secondary/40 px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {activeUser.avatar || activeUser.name.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{activeUser.name}</p>
            <p className="truncate text-xs text-muted-foreground">{activeUser.role === 'Médecin' ? 'Dentiste' : activeUser.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-4">
        {navItems
          .filter(item => !item.roles || item.roles.includes(activeUser.role))
          .map(item => {
            const active = isActive(item.href);
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => router.push(item.href)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                  active
                    ? 'bg-linear-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/20'
                    : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? 'bg-white/15' : 'bg-background'}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            );
          })}
      </nav>

      {activeUser.isKid ? (
        <div className="border-t border-border/70 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Zone enfant</p>
          <div className="mt-3 space-y-2.5">
            {[
              { label: 'Arcade des jeux', href: '/kids-zone/games', icon: <Gamepad2 className="h-4 w-4" />, subtitle: '15 mini-jeux pour gagner des étoiles' },
              { label: 'Récompenses', href: '/kids-zone/rewards', icon: <Sparkles className="h-4 w-4" />, subtitle: 'Échange tes étoiles contre des cadeaux' },
            ].map(item => {
              const active = isActive(item.href);
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                    active
                      ? 'bg-linear-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/20'
                      : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? 'bg-white/15' : 'bg-background'}`}>
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold truncate">{item.label}</span>
                    <span className="block text-xs text-muted-foreground line-clamp-1">{item.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="border-t border-border/70 px-5 py-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-foreground">Organisation</p>
          <ThemeToggle />
        </div>
        
      </div>
    </aside>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      title="Basculer thème"
      className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
    >
      {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}