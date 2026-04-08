'use client';

import { useAppContext } from '@/lib/context';
import {
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Brain,
  ScanLine,
  HeartPulse,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export function LandingPage() {
  const { setCurrentPage } = useAppContext();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-white text-lg font-bold">D</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Dent<span className="text-primary">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Fonctionnalités
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              Comment ça marche
            </a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">
              Témoignages
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 rounded-lg border border-border bg-card/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center justify-center"
              title="Basculer thème"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="px-6 py-2.5 border border-border bg-card text-foreground font-semibold rounded-lg hover:bg-secondary transition-all text-sm"
            >
              Créer un compte
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 text-sm"
            >
              Connexion
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-8">
                <Zap className="w-4 h-4" />
                Propulsé par l&apos;Intelligence Artificielle
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 font-display">
                Détection des caries par{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  radiographie IA
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
                DentAI analyse vos radiographies panoramiques avec une précision de 94% pour
                détecter les caries, évaluer les risques et assister les professionnels dentaires
                dans leur diagnostic.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="group px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/25 text-base flex items-center justify-center gap-3"
                >
                  Commencer maintenant
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 border-2 border-border text-foreground font-bold rounded-xl hover:bg-secondary transition-all text-base text-center"
                >
                  En savoir plus
                </a>
              </div>

              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-border/50">
                <div>
                  <p className="text-3xl font-bold text-foreground">94%</p>
                  <p className="text-sm text-muted-foreground">Précision IA</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <p className="text-3xl font-bold text-foreground">2k+</p>
                  <p className="text-sm text-muted-foreground">Analyses réalisées</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <p className="text-3xl font-bold text-foreground">150+</p>
                  <p className="text-sm text-muted-foreground">Praticiens</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:block relative">
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-2xl blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-2xl blur-xl" />

                {/* Mock X-ray display */}
                <div className="relative rounded-2xl overflow-hidden bg-black/40 p-6">
                  <svg viewBox="0 0 400 250" className="w-full opacity-40">
                    <path d="M50,125 Q200,30 350,125" stroke="white" strokeWidth="2" fill="none" />
                    {Array.from({ length: 16 }).map((_, i) => (
                      <rect
                        key={i}
                        x={55 + i * 18.75}
                        y={110}
                        width="14"
                        height="28"
                        stroke="white"
                        strokeWidth="0.8"
                        fill="none"
                        rx="2"
                      />
                    ))}
                  </svg>

                  {/* Detection markers */}
                  <div className="absolute top-12 left-1/4 w-6 h-6 border-2 border-red-400 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                  </div>
                  <div className="absolute top-16 right-1/3 w-6 h-6 border-2 border-amber-400 rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  </div>
                  <div className="absolute bottom-16 left-1/3 w-6 h-6 border-2 border-red-400 rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                  </div>
                </div>

                {/* Mock analysis bar */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Analyse en cours...</span>
                    <span className="text-green-400 text-sm font-semibold">94%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full w-[94%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm mb-3 uppercase tracking-wider">
              Fonctionnalités
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 font-display">
              Une plateforme complète pour le diagnostic dentaire
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              DentAI combine l&apos;intelligence artificielle avec l&apos;expertise médicale
              pour offrir un diagnostic précis et rapide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-7 h-7" />,
                title: 'Détection IA avancée',
                description:
                  'Algorithme de deep learning entraîné sur des milliers de radiographies pour une détection précise des caries.',
                color: 'bg-primary/10 text-primary',
              },
              {
                icon: <ScanLine className="w-7 h-7" />,
                title: 'Analyse panoramique',
                description:
                  'Support complet des radiographies panoramiques avec identification automatique de chaque dent.',
                color: 'bg-accent/10 text-accent',
              },
              {
                icon: <BarChart3 className="w-7 h-7" />,
                title: 'Prédiction de risques',
                description:
                  'Évaluation des risques futurs basée sur l\'historique patient et les tendances détectées.',
                color: 'bg-amber-500/10 text-amber-600',
              },
              {
                icon: <Shield className="w-7 h-7" />,
                title: 'Données sécurisées',
                description:
                  'Conformité totale avec les normes de sécurité médicale et protection des données patients.',
                color: 'bg-green-500/10 text-green-600',
              },
              {
                icon: <Users className="w-7 h-7" />,
                title: 'Multi-utilisateurs',
                description:
                  'Accès différencié pour dentistes, radiologues et patients avec tableaux de bord personnalisés.',
                color: 'bg-purple-500/10 text-purple-600',
              },
              {
                icon: <HeartPulse className="w-7 h-7" />,
                title: 'Suivi patient',
                description:
                  'Historique complet des analyses, rendez-vous et évolution du traitement pour chaque patient.',
                color: 'bg-rose-500/10 text-rose-600',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-card text-card-foreground rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm mb-3 uppercase tracking-wider">
              Comment ça marche
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 font-display">
              En 3 étapes simples
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Importez la radiographie',
                description:
                  'Téléchargez la radiographie panoramique du patient au format DICOM, PNG ou JPG.',
              },
              {
                step: '02',
                title: 'Analyse automatique',
                description:
                  'Notre IA analyse l\'image en quelques secondes et identifie les zones à risque.',
              },
              {
                step: '03',
                title: 'Résultats détaillés',
                description:
                  'Consultez le rapport complet avec les détections, scores de confiance et recommandations.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                  <span className="text-2xl font-extrabold text-primary">{item.step}</span>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
                )}
                <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm mb-3 uppercase tracking-wider">
              Témoignages
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 font-display">
              Ils nous font confiance
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Karim Hajji',
                role: 'Chirurgien-dentiste, Tunis',
                text: 'DentAI a transformé notre pratique. La détection précoce des caries nous permet d\'intervenir plus tôt et d\'offrir de meilleurs résultats.',
              },
              {
                name: 'Dr. Salma Mejri',
                role: 'Radiologue, Sfax',
                text: 'La précision de l\'IA est impressionnante. C\'est un outil d\'aide à la décision indispensable pour confirmer mes diagnostics.',
              },
              {
                name: 'Prof. Youssef Trabelsi',
                role: 'Chef de service, CHU Monastir',
                text: 'Nous utilisons DentAI dans notre service depuis 6 mois. Le gain de temps et la fiabilité des résultats sont remarquables.',
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-card text-card-foreground rounded-2xl p-8 border border-border/50 shadow-sm"
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-card-foreground mb-6 leading-relaxed text-sm">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {testimonial.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-[#0A6EBD] to-[#09589a] dark:from-[#1e40af] dark:to-[#0f172a] rounded-3xl p-12 lg:p-16 shadow-2xl shadow-slate-900/30">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-display">
              Prêt à révolutionner votre diagnostic ?
            </h2>
            <p className="text-white/80 mb-10 max-w-lg mx-auto">
              Rejoignez les praticiens qui font confiance à DentAI pour améliorer la qualité de
              leurs soins dentaires.
            </p>
            <button
              onClick={() => setCurrentPage('login')}
              className="group px-10 py-4 bg-white text-[#0A6EBD] font-bold rounded-xl hover:bg-white/90 transition-all text-base inline-flex items-center gap-3 shadow-lg"
            >
              Créer un compte gratuitement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">D</span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  Dent<span className="text-primary">AI</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Système intelligent de détection des caries par intelligence artificielle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Produit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">Comment ça marche</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Tarification</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Conditions d&apos;utilisation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 DentAI. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Conforme aux normes RGPD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
