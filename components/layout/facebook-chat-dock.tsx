'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@/lib/context';
import { MessageCircle, Search, Send, X } from 'lucide-react';
import type { UserRole } from '@/lib/types';

type DoctorRecord = {
  id: string;
  name: string;
  email: string;
};

type PatientRecord = {
  id: string;
  name: string;
  patientEmail?: string;
  doctor?: string;
};

type ChatMessage = {
  id: string;
  doctorId: string;
  patientEmail: string;
  from: 'patient' | 'doctor';
  text: string;
  timestamp: string;
};

type Contact = {
  id: string;
  name: string;
  subtitle: string;
  status: string;
  lastMessage?: ChatMessage;
  doctorId: string;
  patientEmail: string;
};

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('');
}

function formatTime(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function activeLabel(lastTimestamp?: string) {
  if (!lastTimestamp) return 'Hors ligne';

  const ts = new Date(lastTimestamp).getTime();
  if (Number.isNaN(ts)) return 'Hors ligne';

  const diffMin = Math.floor((Date.now() - ts) / 60000);
  if (diffMin <= 5) return 'Actif maintenant';
  if (diffMin <= 59) return `Actif il y a ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours <= 23) return `Actif il y a ${diffHours} h`;

  return 'Hors ligne';
}

export function FacebookChatDock() {
  const { user, currentPage } = useAppContext();

  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [isListOpen, setIsListOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const role: UserRole | undefined = user?.role;

  const shouldRender = !!user && currentPage !== 'landing' && currentPage !== 'login';

  const currentDoctor = useMemo(() => {
    if (!doctors.length || !user?.email) return doctors[0];
    return doctors.find(doc => doc.email.toLowerCase() === user.email.toLowerCase()) || doctors[0];
  }, [doctors, user?.email]);

  const currentDoctorId = currentDoctor?.id || '';

  const reloadMessages = async (nextRole: UserRole, doctorId: string, patientEmail: string) => {
    const query =
      nextRole === 'Médecin'
        ? `doctorId=${encodeURIComponent(doctorId)}`
        : `patientEmail=${encodeURIComponent(patientEmail)}`;

    const response = await fetch(`/api/chats?${query}`);
    const data = await response.json();
    setMessages(Array.isArray(data?.chats) ? data.chats : []);
  };

  useEffect(() => {
    if (!shouldRender || !role) return;

    const load = async () => {
      try {
        const [doctorsRes, bootstrapRes] = await Promise.all([
          fetch('/api/doctors'),
          fetch('/api/data/bootstrap'),
        ]);

        const doctorsData = await doctorsRes.json();
        const bootstrapData = await bootstrapRes.json();

        const doctorsList = Array.isArray(doctorsData?.doctors) ? doctorsData.doctors : [];
        const patientsList = Array.isArray(bootstrapData?.patients) ? bootstrapData.patients : [];

        setDoctors(doctorsList);
        setPatients(patientsList);

        const resolvedDoctor =
          doctorsList.find((doctor: DoctorRecord) => doctor.email.toLowerCase() === user?.email?.toLowerCase()) ||
          doctorsList[0];

        const doctorId = resolvedDoctor?.id || '';
        const patientEmail = user?.email || '';

        if ((role === 'Médecin' && doctorId) || (role === 'Patient' && patientEmail)) {
          await reloadMessages(role, doctorId, patientEmail);
        }
      } catch {
        setDoctors([]);
        setPatients([]);
        setMessages([]);
      }
    };

    load();
  }, [shouldRender, role, user?.email]);

  useEffect(() => {
    if (!shouldRender || !role) return;

    const canPoll = role === 'Médecin' ? !!currentDoctorId : !!user?.email;
    if (!canPoll) return;

    const timer = setInterval(() => {
      void reloadMessages(role, currentDoctorId, user?.email || '');
    }, 7000);

    return () => clearInterval(timer);
  }, [shouldRender, role, currentDoctorId, user?.email]);

  const contacts = useMemo(() => {
    if (!role || !user?.email) return [] as Contact[];

    const query = search.trim().toLowerCase();

    if (role === 'Médecin') {
      const byPatient = new Map<string, ChatMessage[]>();

      for (const msg of messages) {
        if (currentDoctorId && msg.doctorId !== currentDoctorId) continue;
        if (!byPatient.has(msg.patientEmail)) {
          byPatient.set(msg.patientEmail, []);
        }
        byPatient.get(msg.patientEmail)?.push(msg);
      }

      for (const patient of patients) {
        if (!patient.patientEmail) continue;
        if (currentDoctor?.name && patient.doctor && patient.doctor !== currentDoctor.name) continue;
        if (!byPatient.has(patient.patientEmail)) {
          byPatient.set(patient.patientEmail, []);
        }
      }

      const list = Array.from(byPatient.entries()).map(([patientEmail, conv]) => {
        const sorted = [...conv].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const lastMessage = sorted[sorted.length - 1];
        const patient = patients.find(p => p.patientEmail?.toLowerCase() === patientEmail.toLowerCase());

        return {
          id: patientEmail,
          name: patient?.name || patientEmail,
          subtitle: patientEmail,
          status: activeLabel(lastMessage?.timestamp),
          lastMessage,
          doctorId: currentDoctorId,
          patientEmail,
        } satisfies Contact;
      });

      return list
        .filter(contact => {
          if (!query) return true;
          return (
            contact.name.toLowerCase().includes(query) ||
            contact.subtitle.toLowerCase().includes(query)
          );
        })
        .sort((a, b) => {
          const at = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
          const bt = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
          return bt - at;
        });
    }

    const byDoctor = new Map<string, ChatMessage[]>();
    for (const msg of messages) {
      if (msg.patientEmail.toLowerCase() !== user.email.toLowerCase()) continue;
      if (!byDoctor.has(msg.doctorId)) {
        byDoctor.set(msg.doctorId, []);
      }
      byDoctor.get(msg.doctorId)?.push(msg);
    }

    for (const doctor of doctors) {
      if (!byDoctor.has(doctor.id)) {
        byDoctor.set(doctor.id, []);
      }
    }

    const list = Array.from(byDoctor.entries()).map(([doctorId, conv]) => {
      const sorted = [...conv].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const lastMessage = sorted[sorted.length - 1];
      const doctor = doctors.find(d => d.id === doctorId);

      return {
        id: doctorId,
        name: doctor?.name || 'Dentiste',
        subtitle: doctor?.email || '',
        status: activeLabel(lastMessage?.timestamp),
        lastMessage,
        doctorId,
        patientEmail: user.email,
      } satisfies Contact;
    });

    return list
      .filter(contact => {
        if (!query) return true;
        return (
          contact.name.toLowerCase().includes(query) ||
          contact.subtitle.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const at = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
        const bt = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
        return bt - at;
      });
  }, [role, user?.email, search, messages, patients, doctors, currentDoctorId, currentDoctor?.name]);

  useEffect(() => {
    if (!selectedContactId && contacts.length > 0) {
      setSelectedContactId(contacts[0].id);
    }
  }, [contacts, selectedContactId]);

  const selectedContact = contacts.find(contact => contact.id === selectedContactId);

  const selectedConversation = useMemo(() => {
    if (!selectedContact || !role || !user?.email) return [] as ChatMessage[];

    return messages
      .filter(msg => {
        if (role === 'Médecin') {
          return msg.doctorId === selectedContact.doctorId && msg.patientEmail === selectedContact.patientEmail;
        }
        return msg.doctorId === selectedContact.doctorId && msg.patientEmail.toLowerCase() === user.email.toLowerCase();
      })
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [selectedContact, role, user?.email, messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !selectedContact || !role) return;

    const optimistic: ChatMessage = {
      id: `tmp_${Date.now()}`,
      doctorId: selectedContact.doctorId,
      patientEmail: selectedContact.patientEmail,
      from: role === 'Médecin' ? 'doctor' : 'patient',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimistic]);
    setInput('');

    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedContact.doctorId,
          patientEmail: selectedContact.patientEmail,
          from: role === 'Médecin' ? 'doctor' : 'patient',
          text,
        }),
      });

      if (!response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== optimistic.id));
        return;
      }

      await reloadMessages(role, selectedContact.doctorId, selectedContact.patientEmail);
    } catch {
      setMessages(prev => prev.filter(msg => msg.id !== optimistic.id));
    }
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 hidden md:block">
      <div className="relative">
        {isListOpen && (
          <div className="w-[320px] bg-card text-card-foreground border border-border rounded-xl shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">Messages</p>
              <button
                type="button"
                onClick={() => setIsListOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-secondary/80 inline-flex items-center justify-center"
                aria-label="Réduire la liste"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher"
                  className="w-full rounded-full border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="max-h-[360px] overflow-y-auto p-2 space-y-1">
              {contacts.map(contact => {
                const isActive = contact.status.startsWith('Actif');
                const isSelected = selectedContactId === contact.id;

                return (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setSelectedContactId(contact.id);
                      setIsChatOpen(true);
                    }}
                    className={`w-full text-left rounded-lg px-3 py-2 transition-colors ${
                      isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-secondary/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">
                          {initials(contact.name)}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                            isActive ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{contact.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {contact.lastMessage?.from === (role === 'Médecin' ? 'doctor' : 'patient') ? 'Vous: ' : ''}
                          {contact.lastMessage?.text || 'Démarrer la conversation'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}

              {contacts.length === 0 && (
                <p className="text-sm text-muted-foreground px-2 py-6 text-center">Aucune conversation disponible.</p>
              )}
            </div>
          </div>
        )}

        {!isListOpen && (
          <button
            type="button"
            onClick={() => setIsListOpen(true)}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl inline-flex items-center justify-center hover:bg-primary/90 transition-colors"
            aria-label="Ouvrir la messagerie"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}

        {selectedContact && isChatOpen && (
          <div className="absolute bottom-0 right-[332px] w-[360px] bg-card text-card-foreground border border-border rounded-xl shadow-2xl overflow-hidden">
            <div className="border-b border-border px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">
                    {initials(selectedContact.name)}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                      selectedContact.status.startsWith('Actif') ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{selectedContact.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{selectedContact.status}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-secondary/80 inline-flex items-center justify-center"
                aria-label="Fermer chat"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="h-[300px] overflow-y-auto px-4 py-3 space-y-3 bg-background/40">
              {selectedConversation.map(msg => {
                const isMe = msg.from === (role === 'Médecin' ? 'doctor' : 'patient');
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                        isMe
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-secondary text-secondary-foreground rounded-bl-md'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`mt-1 text-[11px] ${isMe ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {selectedConversation.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-12">Pas encore de messages.</p>
              )}
            </div>

            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder="Écrire un message..."
                  className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={!input.trim() || !selectedContact}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Envoyer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
