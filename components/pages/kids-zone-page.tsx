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
  Camera,
  Wand2,
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
  const [targetColor, setTargetColor] = useState(0);
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
  const [memoryTarget, setMemoryTarget] = useState(1);
  const [memoryMessage, setMemoryMessage] = useState('Mémorise le numéro secret et clique dessus.');
  const [loyalty, setLoyalty] = useState<LoyaltyProfile | null>(null);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [rewardMessage, setRewardMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // AI Kids State
  const [aiKidsPhoto, setAiKidsPhoto] = useState<string | null>(null);
  const [aiKidsScanning, setAiKidsScanning] = useState(false);
  const [aiKidsResult, setAiKidsResult] = useState('');

  useEffect(() => {
    setIsMounted(true);
    setTargetColor(randomIndex(gameColors.length));
    setMemoryTarget(randomIndex(6) + 1);
  }, []);

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

  const handleAiUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAiKidsPhoto(url);
      setAiKidsResult('');
    }
  };

  const runAiKidSimulation = () => {
    setAiKidsScanning(true);
    setAiKidsResult('');
    setTimeout(() => {
      setAiKidsScanning(false);
      setAiKidsResult('🦸‍♂️ Super-héro! Dents 100% magiques détectées !');
      setStars(prev => prev + 5);
      void awardLoyalty(1);
    }, 3000);
  };

  if (!isMounted) return null;

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
          <section className="lg:col-span-2 rounded-3xl border-4 border-sky-300 bg-sky-50/90 p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Palette className="w-32 h-32 text-sky-500 transform group-hover:rotate-12 transition-transform duration-500" />
            </div>
            
            <h2 className="text-2xl font-extrabold text-sky-900 flex items-center gap-3 relative z-10">
              <div className="bg-sky-200 p-2 rounded-xl">
                <Palette className="w-6 h-6 text-sky-700" />
              </div>
              Jeu: Couleur magique
            </h2>
            <p className="text-sky-800/80 mt-3 font-medium relative z-10 text-lg">
              {message}
            </p>
            <p className="bg-sky-200/50 inline-block px-4 py-2 mt-3 rounded-full text-sm font-bold text-sky-900 relative z-10">
              👉 Cherche la pastille numéro {targetColor + 1} !
            </p>
            <div className="grid grid-cols-5 gap-4 mt-8 relative z-10">
              {gameColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handlePickColor(index)}
                  className={`${color} h-20 rounded-[2rem] shadow-lg border-b-4 border-black/10 hover:-translate-y-2 hover:shadow-xl transition-all duration-200 active:scale-95 active:translate-y-1 relative overflow-hidden`}
                  aria-label={`Couleur ${index + 1}`}
                >
                  <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity" />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border-4 border-emerald-300 bg-emerald-50/90 p-8 shadow-xl relative overflow-hidden group flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Rocket className="w-24 h-24 text-emerald-500 transform group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
            </div>
            
            <h2 className="text-2xl font-extrabold text-emerald-900 flex items-center gap-3 relative z-10">
              <div className="bg-emerald-200 p-2 rounded-xl">
                <Rocket className="w-6 h-6 text-emerald-700" />
              </div>
              Défi express
            </h2>
            <p className="text-emerald-800/80 mt-3 font-medium text-sm relative z-10">
              Touche le Booster autant de fois que possible en 10 secondes !
            </p>
            
            <div className="mt-6 flex-1 flex flex-col items-center justify-center relative z-10">
              <div className="relative">
                <div className={`text-6xl font-black ${countdown <= 3 ? 'text-rose-500 animate-pulse' : 'text-emerald-900'}`}>
                  {countdown}s
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3 relative z-10">
              <button
                onClick={startMiniTimer}
                disabled={countdown > 0 && countdown < 10}
                className="w-full rounded-2xl bg-emerald-600 text-white py-4 font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Go !
              </button>
              <button
                onClick={() => {
                  if (countdown > 0 && countdown < 10) setStars(prev => prev + 1);
                }}
                disabled={countdown === 0 || countdown === 10}
                className="w-full rounded-2xl border-4 border-emerald-500 bg-emerald-100 text-emerald-700 py-4 font-black hover:bg-emerald-200 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀 Booster (+1)
              </button>
            </div>
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

          <section className="rounded-3xl border-4 border-indigo-300 bg-indigo-50/90 p-6 shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wand2 className="w-24 h-24 text-indigo-500 transform group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-indigo-900 flex items-center gap-3 relative z-10">
              <div className="bg-indigo-200 p-2 rounded-xl">
                 <Wand2 className="w-6 h-6 text-indigo-700" />
              </div>
              IA Magique du Sourire
            </h2>
            <p className="text-indigo-800/80 mt-3 font-medium text-sm relative z-10">
              Prends une photo de tes dents, l'Intelligence Artificielle va deviner ton super-pouvoir !
            </p>
            
            <div className="mt-6 flex flex-col items-center justify-center relative z-10 h-48 bg-white/50 rounded-2xl border-2 border-dashed border-indigo-300 overflow-hidden">
              {!aiKidsPhoto ? (
                 <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-white/40 transition-colors">
                   <Camera className="w-12 h-12 text-indigo-400 mb-2" />
                   <span className="text-indigo-700 font-bold">Uploader une photo</span>
                   <input type="file" accept="image/*" className="hidden" onChange={handleAiUpload} />
                 </label>
              ) : (
                 <div className="relative w-full h-full rounded-2xl overflow-hidden">
                   <img src={aiKidsPhoto} alt="Dent kids" className="absolute inset-0 w-full h-full object-cover" />
                   {aiKidsScanning && (
                     <div className="absolute inset-0 bg-indigo-900/60 flex flex-col items-center justify-center backdrop-blur-sm">
                       <Wand2 className="w-10 h-10 text-white animate-spin mb-2" />
                       <div className="w-3/4 h-2 bg-indigo-900 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-300 animate-pulse width-full" />
                       </div>
                       <p className="text-white text-xs font-bold mt-2">Scan magique en cours...</p>
                     </div>
                   )}
                   {!aiKidsScanning && aiKidsResult && (
                     <div className="absolute inset-x-0 bottom-0 bg-indigo-600/90 text-white p-3 text-center backdrop-blur-md">
                       <p className="font-black text-sm">{aiKidsResult}</p>
                     </div>
                   )}
                 </div>
              )}
            </div>

            {aiKidsPhoto && !aiKidsScanning && !aiKidsResult && (
               <button
                 onClick={runAiKidSimulation}
                 className="mt-4 w-full rounded-2xl bg-indigo-600 text-white py-3 font-bold hover:bg-indigo-700 transition-colors shadow-lg active:scale-95"
               >
                 🪄 Lancer la magie !
               </button>
            )}
            {aiKidsResult && (
               <button
                 onClick={() => { setAiKidsPhoto(null); setAiKidsResult(''); }}
                 className="mt-4 w-full rounded-2xl border-2 border-indigo-500 bg-indigo-100 text-indigo-700 py-3 font-bold hover:bg-indigo-200 transition-colors active:scale-95"
               >
                 Recommencer
               </button>
            )}
          </section>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
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
          <section className="rounded-3xl border-4 border-amber-300 bg-amber-50/90 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Gamepad2 className="w-24 h-24" />
            </div>
            <h2 className="text-xl font-bold text-amber-800 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-amber-600" />
              Nouveau jeu: Combo brossage
            </h2>
            <p className="text-sm text-amber-700/80 mt-2 z-10 relative">
              Clique vite sur le bouton ! Chaque combo de 15 clics te donne +3 étoiles et plein de points !
            </p>
            <div className="mt-4 flex items-center justify-between rounded-2xl border-2 border-amber-200 bg-white/60 px-5 py-4 z-10 relative">
              <span className="text-sm font-semibold text-amber-800">Total clics</span>
              <span className="text-3xl font-black text-amber-600">{comboClicks}</span>
            </div>
            <button
              type="button"
              onClick={handleComboBrush}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 font-extrabold text-lg hover:from-amber-500 hover:to-orange-600 hover:scale-[1.02] transform transition-all shadow-lg active:scale-95"
            >
              Brosser +1
            </button>
          </section>

          <section className="rounded-3xl border-4 border-indigo-300 bg-indigo-50/90 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Brain className="w-24 h-24" />
            </div>
            <h2 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              Nouveau jeu: Mémoire flash
            </h2>
            <p className="text-sm text-indigo-700/80 mt-2 z-10 relative font-medium">{memoryMessage}</p>
            <p className="mt-3 text-sm font-bold text-indigo-900 z-10 relative">Trouve le chiffre magique (de 1 à 6)</p>
            <div className="mt-4 grid grid-cols-3 gap-3 z-10 relative">
              {Array.from({ length: 6 }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleMemoryGuess(idx + 1)}
                  className="rounded-2xl border-2 border-indigo-200 bg-white px-3 py-4 text-2xl font-black text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 hover:-translate-y-1 transform transition-all shadow-sm active:scale-95"
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border-4 border-rose-300 bg-pink-50/95 backdrop-blur-md p-6 lg:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 rotate-12 opacity-5 pointer-events-none">
            <Gift className="w-80 h-80 text-rose-500" />
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-extrabold text-rose-900 flex items-center gap-3 relative z-10">
            <Gift className="w-8 h-8 text-rose-600" />
            Le Coffre aux Trésors
          </h2>
          <p className="text-rose-700/80 mt-2 font-medium relative z-10 max-w-xl">
            Échange tes points contre de super cadeaux qui t'attendent lors de ta prochaine visite chez le dentiste !
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 lg:gap-6 relative z-10">
            <div className="rounded-2xl border-2 border-rose-200 bg-white/70 p-4 lg:p-6 text-center transform hover:scale-105 transition-transform shadow-sm">
              <div className="w-12 h-12 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
              </div>
              <p className="text-xs uppercase tracking-wider font-bold text-rose-600/70">Points actuels</p>
              <p className="text-3xl lg:text-4xl font-black text-rose-900 mt-1">{loyalty?.points || 0}</p>
            </div>
            <div className="rounded-2xl border-2 border-rose-200 bg-white/70 p-4 lg:p-6 text-center transform hover:scale-105 transition-transform shadow-sm">
              <div className="w-12 h-12 mx-auto bg-sky-100 rounded-full flex items-center justify-center mb-3">
                <Clock3 className="w-6 h-6 text-sky-500" />
              </div>
              <p className="text-xs uppercase tracking-wider font-bold text-rose-600/70">Temps passé</p>
              <p className="text-xl lg:text-3xl font-black text-rose-900 mt-1">{loyalty?.minutesSpent || 0}<span className="text-sm lg:text-lg"> min</span></p>
            </div>
            <div className="rounded-2xl border-2 border-rose-200 bg-white/70 p-4 lg:p-6 text-center transform hover:scale-105 transition-transform shadow-sm">
              <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-xs uppercase tracking-wider font-bold text-rose-600/70">Cadeaux collectés</p>
              <p className="text-3xl lg:text-4xl font-black text-rose-900 mt-1">{loyalty?.collectedRewards?.length || 0}</p>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6 relative z-10">
            {rewards.map(reward => {
              const alreadyCollected = loyalty?.collectedRewards?.includes(reward.id);
              const canCollect = !alreadyCollected && (loyalty?.points || 0) >= reward.cost;

              return (
                <div 
                  key={reward.id} 
                  className={`rounded-2xl relative overflow-hidden transition-all duration-300 border-2 ${
                    canCollect ? 'border-primary shadow-xl scale-[1.02] bg-white' : 'border-border bg-white/50 opacity-90'
                  }`}
                >
                  {/* Top color bar */}
                  <div className={`h-3 w-full ${
                    canCollect ? 'bg-gradient-to-r from-primary to-rose-400' : 'bg-rose-200'
                  }`} />
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-extrabold text-foreground text-lg leading-tight">{reward.title}</p>
                      {alreadyCollected && (
                        <span className="bg-emerald-500 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full">
                          Acquis
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">{reward.description}</p>
                    
                    <div className="mt-4 inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full font-bold text-sm">
                      <Star className="w-4 h-4 fill-amber-500" />
                      Prix: {reward.cost} pts
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-auto">
                    <button
                      type="button"
                      onClick={() => handleCollectReward(reward.id)}
                      disabled={!canCollect}
                      className={`w-full rounded-xl py-3.5 text-base font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                        alreadyCollected
                          ? 'bg-emerald-50 text-emerald-700 cursor-default border-2 border-emerald-200'
                          : canCollect
                          ? 'bg-primary text-white hover:bg-primary/90 hover:scale-105 active:scale-95'
                          : 'bg-secondary text-muted-foreground cursor-not-allowed border border-border/50'
                      }`}
                    >
                      {alreadyCollected && <Trophy className="w-4 h-4" />}
                      {alreadyCollected ? 'Dans ton sac !' : canCollect ? 'Récupérer le trésor' : `Il te manque ${Math.max(0, reward.cost - (loyalty?.points || 0))} pts`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {rewardMessage && (
            <div className="mt-8 relative z-10 flex items-center justify-center gap-2 text-rose-800 bg-rose-100 rounded-xl p-4 font-bold border-2 border-rose-200 animate-in fade-in zoom-in-95">
              <Gift className="w-5 h-5 flex-shrink-0" />
              <p>{rewardMessage}</p>
            </div>
          )}
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
