'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@/lib/context';
import {
  Sparkles,
  Star,
  Palette,
  Rocket,
  Trophy,
  CalendarCheck,
  MessageCircle,
  Search,
  Send,
  Brain,
  Gift,
  Clock3,
  Gamepad2,
} from 'lucide-react';

const gameColors = ['bg-pink-400', 'bg-sky-400', 'bg-yellow-400', 'bg-green-400', 'bg-orange-400'];

const doctorsSeed = [
  { id: 'd1', name: 'Dr. Rami Benayed', city: 'Tunis', specialty: 'Pédodontie' },
  { id: 'd2', name: 'Dr. Salma Jaziri', city: 'Sfax', specialty: 'Orthodontie' },
  { id: 'd3', name: 'Dr. Yassine Trabelsi', city: 'Sousse', specialty: 'Dentisterie générale' },
  { id: 'd4', name: 'Dr. Lina Mansouri', city: 'Nabeul', specialty: 'Soins préventifs enfants' },
];

type DoctorItem = {
  id: string;
  name: string;
  city: string;
  specialty: string;
};

type RewardItem = {
  id: string;
  title: string;
  cost: number;
  description: string;
};

type LoyaltyProfile = {
  patientEmail: string;
  role: 'kid' | 'adult';
  points: number;
  minutesSpent: number;
  collectedRewards: string[];
};

const quizQuestions = [
  {
    question: 'Combien de fois faut-il brosser les dents par jour ?',
    options: ['1 fois', '2 fois', '5 fois'],
    correct: 1,
  },
  {
    question: 'Combien de temps dure un bon brossage ?',
    options: ['20 secondes', '2 minutes', '10 minutes'],
    correct: 1,
  },
  {
    question: 'Que faut-il limiter pour protéger les dents ?',
    options: ['Les fruits', 'L\'eau', 'Les bonbons sucrés'],
    correct: 2,
  },
];

function randomIndex(max: number) {
  return Math.floor(Math.random() * max);
}

export function KidsZonePage() {
  const { user } = useAppContext();
  const [stars, setStars] = useState(0);
  const [targetColor, setTargetColor] = useState(randomIndex(gameColors.length));
  const [message, setMessage] = useState('Trouve la couleur magique !');
  const [countdown, setCountdown] = useState(10);
  const [doctors, setDoctors] = useState<DoctorItem[]>(doctorsSeed);
  const [doctorQuery, setDoctorQuery] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('d1');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentLocation, setAppointmentLocation] = useState('');
  const [appointmentMessage, setAppointmentMessage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ from: 'patient' | 'doctor'; text: string }>>([
    {
      from: 'doctor',
      text: 'Bonjour, je suis votre dentiste. Posez-moi vos questions.',
    },
  ]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizMessage, setQuizMessage] = useState('');
  const [comboClicks, setComboClicks] = useState(0);
  const [memoryTarget, setMemoryTarget] = useState(randomIndex(6) + 1);
  const [memoryMessage, setMemoryMessage] = useState('Mémorise le numéro secret et clique dessus.');
  const [loyalty, setLoyalty] = useState<LoyaltyProfile | null>(null);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [rewardMessage, setRewardMessage] = useState('');

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await fetch('/api/doctors');
        const data = await response.json();
        if (Array.isArray(data?.doctors) && data.doctors.length > 0) {
          setDoctors(data.doctors);
          setSelectedDoctorId(data.doctors[0].id);
        }
      } catch {
        setDoctors(doctorsSeed);
      }
    };

    loadDoctors();
  }, []);

  useEffect(() => {
    const loadChats = async () => {
      if (!user?.email || !selectedDoctorId) return;

      try {
        const response = await fetch(
          `/api/chats?patientEmail=${encodeURIComponent(user.email)}&doctorId=${encodeURIComponent(selectedDoctorId)}`
        );
        const data = await response.json();

        if (Array.isArray(data?.chats) && data.chats.length > 0) {
          setChatMessages(data.chats.map((msg: { from: 'patient' | 'doctor'; text: string }) => ({
            from: msg.from,
            text: msg.text,
          })));
        } else {
          setChatMessages([
            {
              from: 'doctor',
              text: 'Bonjour, je suis votre dentiste. Posez-moi vos questions.',
            },
          ]);
        }
      } catch {
        setChatMessages([
          {
            from: 'doctor',
            text: 'Bonjour, je suis votre dentiste. Posez-moi vos questions.',
          },
        ]);
      }
    };

    loadChats();
  }, [selectedDoctorId, user?.email]);

  useEffect(() => {
    const loadLoyalty = async () => {
      if (!user?.email) return;

      try {
        const response = await fetch(`/api/loyalty?patientEmail=${encodeURIComponent(user.email)}`);
        const data = await response.json();
        if (response.ok) {
          setLoyalty(data.profile || null);
          setRewards(Array.isArray(data.availableRewards) ? data.availableRewards : []);
        }
      } catch {
        setLoyalty(null);
      }
    };

    loadLoyalty();
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email) return;

    const timer = setInterval(async () => {
      try {
        const response = await fetch('/api/loyalty', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientEmail: user.email,
            action: 'heartbeat',
            minutes: 1,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setLoyalty(data.profile || null);
          setRewards(Array.isArray(data.availableRewards) ? data.availableRewards : []);
        }
      } catch {
        // silent heartbeat failure
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [user?.email]);

  const awardLoyalty = async (minutes = 1) => {
    if (!user?.email) return;

    try {
      const response = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientEmail: user.email,
          action: 'heartbeat',
          minutes,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setLoyalty(data.profile || null);
        setRewards(Array.isArray(data.availableRewards) ? data.availableRewards : []);
      }
    } catch {
      // silent points failure
    }
  };

  const title = useMemo(() => {
    if (stars >= 15) return 'Super Héros du Sourire !';
    if (stars >= 8) return 'Champion en progression';
    return 'Explorateur du sourire';
  }, [stars]);

  const filteredDoctors = useMemo(() => {
    const q = doctorQuery.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q)
    );
  }, [doctorQuery]);

  const handlePickColor = (index: number) => {
    if (index === targetColor) {
      setStars(prev => prev + 1);
      setMessage('Bravo ! Tu as trouvé la bonne couleur ✨');
      setTargetColor(randomIndex(gameColors.length));
      void awardLoyalty(1);
    } else {
      setMessage('Presque ! Essaie encore 🌈');
    }
  };

  const startMiniTimer = () => {
    setCountdown(10);
    let timeLeft = 10;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleQuizAnswer = (index: number) => {
    const question = quizQuestions[quizIndex];
    if (index === question.correct) {
      setStars(prev => prev + 2);
      setQuizMessage('Bonne réponse ! +2 étoiles');
      void awardLoyalty(1);
    } else {
      setQuizMessage('Presque. On continue !');
    }

    setQuizIndex(prev => (prev + 1) % quizQuestions.length);
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentDate || !appointmentTime || !appointmentLocation) {
      setAppointmentMessage('Complète la date, l\'heure et ta localisation.');
      return;
    }

    if (!user?.email) {
      setAppointmentMessage('Connecte-toi pour prendre un rendez-vous.');
      return;
    }

    const doctor = doctors.find(d => d.id === selectedDoctorId);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientEmail: user.email,
          doctorId: selectedDoctorId,
          date: appointmentDate,
          time: appointmentTime,
          location: appointmentLocation,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setAppointmentMessage(data?.error || 'Impossible de créer le rendez-vous.');
        return;
      }

      setAppointmentMessage(
        `Rendez-vous enregistré avec ${doctor?.name} le ${appointmentDate} à ${appointmentTime} depuis ${appointmentLocation}.`
      );
      setStars(prev => prev + 1);
      void awardLoyalty(1);
    } catch {
      setAppointmentMessage('Erreur réseau pendant la création du rendez-vous.');
    }
  };

  const handleComboBrush = () => {
    const next = comboClicks + 1;
    setComboClicks(next);

    if (next % 15 === 0) {
      setStars(prev => prev + 3);
      setRewardMessage('Super combo ! +3 étoiles et points fidélité.');
      void awardLoyalty(2);
    }
  };

  const handleMemoryGuess = (guess: number) => {
    if (guess === memoryTarget) {
      setStars(prev => prev + 2);
      setMemoryMessage('Excellent ! Tu as une super mémoire !');
      void awardLoyalty(1);
    } else {
      setMemoryMessage('Presque ! Essaye encore.');
    }
    setMemoryTarget(randomIndex(6) + 1);
  };

  const handleCollectReward = async (rewardId: string) => {
    if (!user?.email) return;

    try {
      const response = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientEmail: user.email,
          action: 'collect',
          rewardId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setRewardMessage(data?.error || 'Impossible de récupérer cette récompense.');
        return;
      }

      setLoyalty(data.profile || null);
      setRewards(Array.isArray(data.availableRewards) ? data.availableRewards : []);
      setRewardMessage(`Récompense récupérée: ${data.reward?.title || 'cadeau'}.`);
    } catch {
      setRewardMessage('Erreur réseau pendant la récupération du cadeau.');
    }
  };

  const handleSendChat = async () => {
    const text = chatInput.trim();
    if (!text) return;
    if (!user?.email) return;

    setChatMessages(prev => [...prev, { from: 'patient', text }]);
    setChatInput('');

    const doctor = doctors.find(d => d.id === selectedDoctorId);

    try {
      await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientEmail: user.email,
          doctorId: selectedDoctorId,
          from: 'patient',
          text,
        }),
      });

      const reply = `Merci pour ton message. ${doctor?.name || 'Le dentiste'} te répondra bientôt. Continue à bien brosser tes dents.`;
      setTimeout(async () => {
        setChatMessages(prev => [...prev, { from: 'doctor', text: reply }]);
        await fetch('/api/chats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientEmail: user.email,
            doctorId: selectedDoctorId,
            from: 'doctor',
            text: reply,
          }),
        });
      }, 700);
    } catch {
      // keep optimistic UI if network fails
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#fde68a_0%,transparent_40%),radial-gradient(circle_at_80%_10%,#93c5fd_0%,transparent_35%),radial-gradient(circle_at_50%_80%,#f9a8d4_0%,transparent_35%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(217,119,6,0.20)_0%,transparent_42%),radial-gradient(circle_at_80%_10%,rgba(30,58,138,0.34)_0%,transparent_38%),radial-gradient(circle_at_50%_80%,rgba(157,23,77,0.22)_0%,transparent_38%)] px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="rounded-3xl border border-border/70 bg-card/85 backdrop-blur-xl p-6 md:p-10 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-1 text-sm font-semibold text-foreground">
                <Sparkles className="w-4 h-4" />
                Zone Kids
              </p>
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mt-4">
                Bienvenue dans le Monde des Sourires
              </h1>
              <p className="text-muted-foreground mt-3 max-w-2xl">
                Ici, tu peux jouer, gagner des étoiles, et apprendre à prendre soin de tes dents en t'amusant.
              </p>
            </div>
            <div className="rounded-2xl bg-card p-4 border border-border min-w-[220px]">
              <p className="text-sm text-muted-foreground">Ton rang</p>
              <p className="text-xl font-bold text-foreground">{title}</p>
              <p className="text-sm text-amber-600 mt-2 inline-flex items-center gap-1 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                {stars} étoiles gagnées
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 rounded-3xl border border-border/70 bg-card/90 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Jeu: Couleur magique
            </h2>
            <p className="text-muted-foreground mt-2">{message}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Clique sur la pastille de couleur <strong>{targetColor + 1}</strong>.
            </p>
            <div className="grid grid-cols-5 gap-3 mt-5">
              {gameColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handlePickColor(index)}
                  className={`${color} h-16 rounded-2xl shadow-md hover:scale-105 transition-transform active:scale-95`}
                  aria-label={`Couleur ${index + 1}`}
                />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Défi express
            </h2>
            <p className="text-sm text-muted-foreground">
              Lance un mini timer de 10 secondes et touche un max de fois le bouton Booster !
            </p>
            <p className="text-3xl font-black text-foreground">{countdown}s</p>
            <button
              onClick={startMiniTimer}
              className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-bold hover:bg-primary/90 transition-colors"
            >
              Démarrer le timer
            </button>
            <button
              onClick={() => setStars(prev => prev + 1)}
              className="w-full rounded-xl bg-emerald-500 text-white py-3 font-bold hover:bg-emerald-600 transition-colors"
            >
              Booster +1 étoile
            </button>
          </section>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Quiz du sourire
            </h2>
            <p className="text-foreground mt-3 font-semibold">{quizQuestions[quizIndex].question}</p>
            <div className="mt-4 grid gap-2">
              {quizQuestions[quizIndex].options.map((option, idx) => (
                <button
                  key={option}
                  onClick={() => handleQuizAnswer(idx)}
                  className="rounded-xl border border-border bg-card px-4 py-3 text-left text-foreground hover:bg-secondary/70 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
            {quizMessage && <p className="mt-3 text-sm font-semibold text-emerald-700">{quizMessage}</p>}
          </section>

          <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Search className="w-5 h-5" />
              Chercher un dentiste
            </h2>
            <input
              value={doctorQuery}
              onChange={e => setDoctorQuery(e.target.value)}
              placeholder="Chercher par nom, ville ou spécialité"
              className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40"
            />

            <div className="mt-4 max-h-52 overflow-y-auto space-y-2">
              {filteredDoctors.map(doctor => (
                <button
                  key={doctor.id}
                  onClick={() => setSelectedDoctorId(doctor.id)}
                  className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                    selectedDoctorId === doctor.id
                      ? 'border-primary/60 bg-primary/10'
                      : 'border-border bg-card hover:bg-secondary/70'
                  }`}
                >
                  <p className="font-semibold text-foreground">{doctor.name}</p>
                  <p className="text-sm text-muted-foreground">{doctor.specialty} · {doctor.city}</p>
                </button>
              ))}
              {filteredDoctors.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun dentiste trouvé.</p>
              )}
            </div>
          </section>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Gamepad2 className="w-5 h-5" />
              Nouveau jeu: Combo brossage
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Clique vite sur le bouton. Chaque combo de 15 clics donne des étoiles et des points.
            </p>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
              <span className="text-sm text-muted-foreground">Total clics</span>
              <span className="text-xl font-black text-foreground">{comboClicks}</span>
            </div>
            <button
              type="button"
              onClick={handleComboBrush}
              className="mt-4 w-full rounded-xl bg-primary text-primary-foreground py-3 font-bold hover:bg-primary/90 transition-colors"
            >
              Brosser +1
            </button>
          </section>

          <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Nouveau jeu: Mémoire flash
            </h2>
            <p className="text-sm text-muted-foreground mt-2">{memoryMessage}</p>
            <p className="mt-3 text-sm font-semibold text-foreground">Trouve le chiffre magique</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleMemoryGuess(idx + 1)}
                  className="rounded-xl border border-border bg-background px-3 py-2 font-semibold text-foreground hover:bg-secondary/70 transition-colors"
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-xl">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Coffre cadeaux fidélité
          </h2>

          <div className="mt-4 grid md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Points</p>
              <p className="text-2xl font-black text-foreground">{loyalty?.points || 0}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock3 className="w-3 h-3" />Temps passé</p>
              <p className="text-2xl font-black text-foreground">{loyalty?.minutesSpent || 0} min</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Objets collectés</p>
              <p className="text-2xl font-black text-foreground">{loyalty?.collectedRewards?.length || 0}</p>
            </div>
          </div>

          <div className="mt-5 grid md:grid-cols-3 gap-3">
            {rewards.map(reward => {
              const alreadyCollected = loyalty?.collectedRewards?.includes(reward.id);
              const canCollect = !alreadyCollected && (loyalty?.points || 0) >= reward.cost;

              return (
                <div key={reward.id} className="rounded-xl border border-border bg-background p-4">
                  <p className="font-semibold text-foreground">{reward.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{reward.description}</p>
                  <p className="text-xs mt-2 text-primary font-semibold">Coût: {reward.cost} points</p>
                  <button
                    type="button"
                    onClick={() => handleCollectReward(reward.id)}
                    disabled={!canCollect}
                    className="mt-3 w-full rounded-lg py-2 text-sm font-semibold bg-primary text-primary-foreground disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed"
                  >
                    {alreadyCollected ? 'Déjà récupéré' : canCollect ? 'Récupérer' : 'Points insuffisants'}
                  </button>
                </div>
              );
            })}
          </div>

          {rewardMessage && <p className="mt-3 text-sm font-semibold text-emerald-700">{rewardMessage}</p>}
        </section>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CalendarCheck className="w-5 h-5" />
              Prendre un rendez-vous
            </h2>

            <form onSubmit={handleBookAppointment} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={e => setAppointmentDate(e.target.value)}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                />
                <input
                  type="time"
                  value={appointmentTime}
                  onChange={e => setAppointmentTime(e.target.value)}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <input
                type="text"
                value={appointmentLocation}
                onChange={e => setAppointmentLocation(e.target.value)}
                placeholder="Ta localisation (quartier / ville)"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-sky-600 text-white py-3 font-bold hover:bg-sky-700 transition-colors"
              >
                Confirmer le rendez-vous
              </button>
            </form>

            {appointmentMessage && (
              <p className="mt-3 text-sm font-semibold text-emerald-700">{appointmentMessage}</p>
            )}
          </section>

          <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat avec ton dentiste
            </h2>

            <div className="mt-4 h-52 overflow-y-auto rounded-xl border border-border bg-background p-3 space-y-2">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.from === 'patient'
                      ? 'ml-auto bg-sky-600 text-white'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ecris ton message..."
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="button"
                onClick={handleSendChat}
                className="rounded-xl bg-primary text-primary-foreground px-4 hover:bg-primary/90 transition-colors"
                aria-label="Envoyer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-xl">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Effets et récompenses
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-semibold animate-bounce">
              Badge Sourire
            </span>
            <span className="px-4 py-2 rounded-full bg-sky-100 text-sky-700 font-semibold animate-pulse">
              Badge Arc-en-ciel
            </span>
            <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-semibold animate-[pulse_1.5s_ease-in-out_infinite]">
              Badge Super Dent
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
