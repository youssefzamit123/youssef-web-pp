'use client';

import {
  Activity,
  ArrowUpRight,
  ArrowRight,
  Brain,
  CalendarCheck,
  CheckCircle,
  HeartPulse,
  Layers,
  LineChart,
  Moon,
  Shield,
  Sparkles,
  Star,
  Sun,
  Users,
  Zap,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useRouter } from 'next/navigation';


export function LandingPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_15%,rgba(14,116,207,0.12),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_44%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_10%_12%,rgba(14,116,207,0.22),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(16,185,129,0.2),transparent_24%),linear-gradient(180deg,#020617_0%,#0b1220_38%,#090f1c_100%)]">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-cyan-400 shadow-lg shadow-sky-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-foreground">
              Dent<span className="text-sky-500">AI</span> Studio
            </span>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground md:flex">
            <a href="#produit" className="transition-colors hover:text-foreground">
              Produit
            </a>
            <a href="#valeur" className="transition-colors hover:text-foreground">
              Valeur
            </a>
            <a href="#adoption" className="transition-colors hover:text-foreground">
              Adoption
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
              title="Basculer thème"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => router.push('/login?mode=signup')}
              className="hidden rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80 sm:inline-flex"
            >
              Créer un compte
            </button>
            <button
              onClick={() => router.push('/login?mode=login')}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-600/20"
            >
              Connexion
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <section className="px-4 pb-14 pt-10 sm:px-6 lg:pt-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="rounded-4xl border border-sky-200/50 bg-[linear-gradient(130deg,rgba(255,255,255,0.82),rgba(240,249,255,0.7))] p-6 shadow-[0_26px_70px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:border-sky-900/40 dark:bg-[linear-gradient(130deg,rgba(2,6,23,0.9),rgba(12,26,45,0.84))] sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/60 bg-sky-100/70 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-sky-700 dark:border-sky-800/60 dark:bg-sky-950/60 dark:text-sky-300">
              <Zap className="h-4 w-4" />
              Nouvelle génération DentAI
            </div>

            <h1 className="mt-5 text-4xl font-black leading-tight text-slate-900 dark:text-white sm:text-5xl">
              Le cockpit clinique qui transforme chaque radio en action.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              DentAI centralise l&apos;analyse des caries, le suivi patient et la collaboration médecin-patient
              dans une expérience moderne, rapide et fiable.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/login?mode=signup')}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-500/30"
              >
                Démarrer avec DentAI
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <a
                href="#produit"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/70"
              >
                Explorer la plateforme
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Précision IA</p>
                <p className="mt-1 text-2xl font-black text-foreground">94%</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Dossiers traités</p>
                <p className="mt-1 text-2xl font-black text-foreground">2 000+</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Cabinets actifs</p>
                <p className="mt-1 text-2xl font-black text-foreground">150+</p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200/70 bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(15,40,70,0.94))] p-6 text-white shadow-[0_28px_70px_rgba(2,6,23,0.45)] sm:p-7">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200">Aperçu temps réel</p>
              <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-[11px] font-bold text-emerald-200">En ligne</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center gap-2 text-sky-100/85">
                  <LineChart className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wide">Risque global</span>
                </div>
                <p className="mt-2 text-2xl font-black">45/100</p>
                <p className="text-xs text-sky-100/70">Priorisation clinique automatique</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center gap-2 text-sky-100/85">
                  <CalendarCheck className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wide">Rendez-vous</span>
                </div>
                <p className="mt-2 text-2xl font-black">12</p>
                <p className="text-xs text-sky-100/70">Demandes en attente aujourd&apos;hui</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-sky-100/70">Parcours IA</p>
              <div className="mt-3 space-y-3">
                {[
                  { icon: <Layers className="h-4 w-4" />, label: 'Import radiographie', detail: 'DICOM, PNG, JPG' },
                  { icon: <Brain className="h-4 w-4" />, label: 'Analyse modèle', detail: 'Adulte ou enfant' },
                  { icon: <Activity className="h-4 w-4" />, label: 'Décision clinique', detail: 'Rapport exploitable' },
                ].map(step => (
                  <div key={step.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-sky-100">{step.icon}</span>
                      <p className="text-sm font-semibold text-white">{step.label}</p>
                    </div>
                    <p className="text-xs text-sky-100/70">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="produit" className="px-4 py-10 sm:px-6 lg:py-14">
        <div className="mx-auto max-w-7xl rounded-4xl border border-border/60 bg-card/85 p-6 shadow-xl backdrop-blur sm:p-8">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Produit</p>
              <h2 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">Une plateforme pensée pour le flux réel du cabinet</h2>
            </div>
            <a
              href="#valeur"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/70"
            >
              Voir la valeur
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: <Brain className="h-5 w-5" />,
                title: 'IA double parcours',
                desc: 'Analyse adulte et enfant avec sélection explicite pour le médecin.',
              },
              {
                icon: <Users className="h-5 w-5" />,
                title: 'Expérience par rôle',
                desc: 'Espace dédié médecin, patient et enfant, sans écran générique.',
              },
              {
                icon: <LineChart className="h-5 w-5" />,
                title: 'Triage priorisé',
                desc: 'Dossiers sensibles, score de risque et actions cliniques visibles immédiatement.',
              },
              {
                icon: <Shield className="h-5 w-5" />,
                title: 'Traçabilité clinique',
                desc: 'Historique des analyses, rendez-vous et échanges dans un seul fil.',
              },
            ].map(item => (
              <article key={item.title} className="rounded-3xl border border-border/70 bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                  {item.icon}
                </span>
                <h3 className="mt-4 text-lg font-black text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="valeur" className="px-4 py-4 sm:px-6 lg:py-10">
        <div className="mx-auto max-w-7xl grid gap-5 lg:grid-cols-3">
          <article className="rounded-4xl border border-emerald-200/50 bg-[linear-gradient(145deg,rgba(236,253,245,0.92),rgba(217,249,234,0.86))] p-6 shadow-lg dark:border-emerald-900/35 dark:bg-[linear-gradient(145deg,rgba(4,35,28,0.9),rgba(10,52,39,0.88))]">
            <HeartPulse className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
            <h3 className="mt-4 text-xl font-black text-foreground">Moins de friction clinique</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Les décisions ne dépendent plus de 4 écrans différents. L&apos;équipe agit plus vite, avec plus de clarté.
            </p>
          </article>

          <article className="rounded-4xl border border-sky-200/50 bg-[linear-gradient(145deg,rgba(239,246,255,0.92),rgba(224,242,254,0.86))] p-6 shadow-lg dark:border-sky-900/35 dark:bg-[linear-gradient(145deg,rgba(8,37,71,0.9),rgba(10,47,88,0.88))]">
            <Activity className="h-6 w-6 text-sky-600 dark:text-sky-300" />
            <h3 className="mt-4 text-xl font-black text-foreground">Suivi continu patient</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Messages, analyses et rendez-vous sont regroupés. Le patient sent un vrai parcours, pas une suite d&apos;outils.
            </p>
          </article>

          <article className="rounded-4xl border border-amber-200/50 bg-[linear-gradient(145deg,rgba(255,251,235,0.92),rgba(254,243,199,0.86))] p-6 shadow-lg dark:border-amber-900/35 dark:bg-[linear-gradient(145deg,rgba(58,35,8,0.88),rgba(74,45,10,0.86))]">
            <CheckCircle className="h-6 w-6 text-amber-600 dark:text-amber-300" />
            <h3 className="mt-4 text-xl font-black text-foreground">Adoption rapide</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Interface claire en français et actions guidées. L&apos;équipe adopte sans formation lourde.
            </p>
          </article>
        </div>
      </section>

      <section id="adoption" className="px-4 pb-16 pt-10 sm:px-6 lg:pb-20">
        <div className="mx-auto max-w-7xl rounded-4xl border border-border/60 bg-card p-6 shadow-xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Adoption</p>
              <h2 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">Déjà validé par des équipes terrain</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                DentAI est conçu pour les vrais rythmes du cabinet: pic de patients, urgences, suivi continu et coordination médecin-patient.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  'Déploiement rapide sans changement lourd de workflow',
                  'Tableaux de bord modernes pour chaque rôle',
                  'Vue unifiée des analyses et de la communication',
                ].map(point => (
                  <p key={point} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{point}</span>
                  </p>
                ))}
              </div>

              <button
                onClick={() => router.push('/login')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-500/25"
              >
                Ouvrir DentAI
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: 'Dr. Karim H.',
                  role: 'Chirurgien-dentiste',
                  text: 'L’interface est enfin au niveau du cabinet moderne. On trouve tout immédiatement.',
                },
                {
                  name: 'Dr. Salma M.',
                  role: 'Radiologue',
                  text: 'Le double parcours adulte/enfant nous fait gagner du temps et évite les erreurs de sélection.',
                },
                {
                  name: 'Responsable clinique',
                  role: 'Centre dentaire',
                  text: 'Le tableau de bord donne des priorités claires dès l’ouverture de journée.',
                },
                {
                  name: 'Équipe patient care',
                  role: 'Cabinet privé',
                  text: 'La messagerie centralisée améliore nettement la réactivité de l’équipe.',
                },
              ].map(item => (
                <article key={item.name + item.role} className="rounded-3xl border border-border/70 bg-secondary/20 p-4">
                  <div className="mb-3 flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">&ldquo;{item.text}&rdquo;</p>
                  <p className="mt-4 text-sm font-bold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>© 2026 DentAI. Plateforme clinique intelligente.</p>
          <div className="inline-flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span>Conforme RGPD et bonnes pratiques sécurité</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
