'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Search, Send, X } from 'lucide-react';

type DoctorRecord = {
  id: string;
  name: string;
  email: string;
};

type PatientRecord = {
  id: string;
  name: string;
  patientEmail?: string;
};

type ChatMessage = {
  id: string;
  doctorId: string;
  patientEmail: string;
  from: 'patient' | 'doctor';
  text: string;
  timestamp: string;
};

function initialsFromName(name: string) {
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
  const last = new Date(lastTimestamp).getTime();
  if (Number.isNaN(last)) return 'Hors ligne';

  const diffMs = Date.now() - last;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin <= 5) return 'Actif maintenant';
  if (diffMin <= 59) return `Actif il y a ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours <= 23) return `Actif il y a ${diffHours} h`;

  return 'Hors ligne';
}

export function DoctorChatPanel() {
  const { user } = useAppContext();

  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedPatientEmail, setSelectedPatientEmail] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');

  const currentDoctor = useMemo(() => {
    const email = user?.email?.toLowerCase();
    if (!email) return doctors[0];
    return doctors.find(doc => doc.email.toLowerCase() === email) || doctors[0];
  }, [doctors, user?.email]);

  const currentDoctorId = currentDoctor?.id;

  const reloadChats = async (doctorId: string) => {
    const response = await fetch(`/api/chats?doctorId=${encodeURIComponent(doctorId)}`);
    const data = await response.json();
    setMessages(Array.isArray(data?.chats) ? data.chats : []);
  };

  useEffect(() => {
    const loadBase = async () => {
      try {
        const [doctorsRes, bootstrapRes] = await Promise.all([
          fetch('/api/doctors'),
          fetch('/api/data/bootstrap'),
        ]);

        const doctorsData = await doctorsRes.json();
        const bootstrapData = await bootstrapRes.json();

        const doctorsList: DoctorRecord[] = Array.isArray(doctorsData?.doctors)
          ? doctorsData.doctors
          : [];
        const patientsList: PatientRecord[] = Array.isArray(bootstrapData?.patients)
          ? bootstrapData.patients
          : [];

        setDoctors(doctorsList);
        setPatients(patientsList);

        const doctorByEmail = doctorsList.find(
          doctor => doctor.email.toLowerCase() === user?.email?.toLowerCase()
        );
        const resolvedDoctor = doctorByEmail || doctorsList[0];

        if (resolvedDoctor?.id) {
          await reloadChats(resolvedDoctor.id);
        }
      } catch {
        setDoctors([]);
        setPatients([]);
        setMessages([]);
      }
    };

    loadBase();
  }, [user?.email]);

  useEffect(() => {
    if (!currentDoctorId) return;

    const timer = setInterval(() => {
      void reloadChats(currentDoctorId);
    }, 8000);

    return () => clearInterval(timer);
  }, [currentDoctorId]);

  const contacts = useMemo(() => {
    const grouped = new Map<string, ChatMessage[]>();

    for (const msg of messages) {
      if (!grouped.has(msg.patientEmail)) {
        grouped.set(msg.patientEmail, []);
      }
      grouped.get(msg.patientEmail)?.push(msg);
    }

    const list = Array.from(grouped.entries()).map(([patientEmail, convMessages]) => {
      const sorted = [...convMessages].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      const lastMessage = sorted[sorted.length - 1];
      const patient =
        patients.find(p => p.patientEmail?.toLowerCase() === patientEmail.toLowerCase()) || null;

      return {
        patientEmail,
        patientName: patient?.name || patientEmail,
        lastMessage,
        status: activeLabel(lastMessage?.timestamp),
      };
    });

    const query = search.trim().toLowerCase();
    const filtered = query
      ? list.filter(
          item =>
            item.patientName.toLowerCase().includes(query) ||
            item.patientEmail.toLowerCase().includes(query)
        )
      : list;

    return filtered.sort((a, b) => {
      const at = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const bt = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return bt - at;
    });
  }, [messages, patients, search]);

  useEffect(() => {
    if (!selectedPatientEmail && contacts.length > 0) {
      setSelectedPatientEmail(contacts[0].patientEmail);
    }
  }, [contacts, selectedPatientEmail]);

  const selectedConversation = useMemo(() => {
    if (!selectedPatientEmail) return [];
    return messages
      .filter(msg => msg.patientEmail.toLowerCase() === selectedPatientEmail.toLowerCase())
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, selectedPatientEmail]);

  const selectedContact = contacts.find(contact => contact.patientEmail === selectedPatientEmail);

  useEffect(() => {
    if (!selectedContact) {
      setIsChatOpen(false);
    }
  }, [selectedContact]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !currentDoctorId || !selectedPatientEmail) return;

    const optimistic: ChatMessage = {
      id: `tmp_${Date.now()}`,
      doctorId: currentDoctorId,
      patientEmail: selectedPatientEmail,
      from: 'doctor',
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
          doctorId: currentDoctorId,
          patientEmail: selectedPatientEmail,
          from: 'doctor',
          text,
        }),
      });

      if (!response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== optimistic.id));
        return;
      }

      await reloadChats(currentDoctorId);
    } catch {
      setMessages(prev => prev.filter(msg => msg.id !== optimistic.id));
    }
  };

  return (
    <section className="relative min-h-[440px]">
      <div className="bg-card text-card-foreground rounded-xl border border-border p-6 md:mr-[340px]">
        <h3 className="text-base font-semibold text-foreground">Messagerie médecin</h3>
        <p className="text-sm text-muted-foreground mt-1">
          La liste des conversations est dockée à droite. Clique sur un patient pour ouvrir la fenêtre chat, style Facebook.
        </p>
      </div>

      <aside className="mt-4 md:mt-0 md:absolute md:right-0 md:top-0 md:w-[320px] bg-card text-card-foreground rounded-xl border border-border overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h4 className="font-semibold text-foreground">Conversations</h4>
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
            const isSelected = selectedPatientEmail === contact.patientEmail;

            return (
              <button
                key={contact.patientEmail}
                onClick={() => {
                  setSelectedPatientEmail(contact.patientEmail);
                  setIsChatOpen(true);
                }}
                className={`w-full text-left rounded-lg px-3 py-2 transition-colors ${
                  isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-secondary/70 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">
                      {initialsFromName(contact.patientName)}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                        isActive ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{contact.patientName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {contact.lastMessage?.from === 'doctor' ? 'Vous: ' : ''}
                      {contact.lastMessage?.text || 'Aucun message'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}

          {contacts.length === 0 && (
            <p className="text-sm text-muted-foreground px-2 py-6 text-center">Aucune conversation pour ce médecin.</p>
          )}
        </div>
      </aside>

      {selectedContact && isChatOpen && (
        <div className="fixed z-50 bottom-4 right-4 md:right-[340px] w-[calc(100vw-2rem)] max-w-[380px] bg-card text-card-foreground rounded-xl border border-border shadow-2xl overflow-hidden">
          <div className="border-b border-border px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">
                  {initialsFromName(selectedContact.patientName)}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                    selectedContact.status.startsWith('Actif') ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                  }`}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{selectedContact.patientName}</p>
                <p className="text-xs text-muted-foreground truncate">{selectedContact.status}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-secondary/80 inline-flex items-center justify-center"
              aria-label="Fermer la conversation"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="h-[300px] overflow-y-auto px-4 py-3 space-y-3 bg-background/40">
            {selectedConversation.map(msg => {
              const isMe = msg.from === 'doctor';
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
                disabled={!input.trim() || !selectedPatientEmail}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Envoyer message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
