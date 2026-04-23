'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Send, Phone, Video, MoreVertical, Search, FileSymlink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MessagesPage() {
  const { user } = useAppContext();
  const router = useRouter();
  const [message, setMessage] = useState('');
  
  if (!user) {
    router.push('/');
    return null;
  }

  const isPatient = user.role === 'Patient';
  const chatPartner = isPatient ? 'Dr. Sarah Martin' : 'Alice Dubois';
  
  const mockMessages = [
    { sender: 'them', text: 'Bonjour, comment allez-vous aujourd\'hui ?', time: '10:45' },
    { sender: 'me', text: 'Bonjour ! J\'ai une légère douleur à la molaire droite depuis hier soir.', time: '10:50' },
    { sender: 'them', text: 'D\'accord. Pouvez-vous passer au cabinet demain à 14h pour qu\'on vérifie avec une radio ?', time: '10:52' },
  ];

  return (
    <div className="h-[calc(100vh-64px)] bg-background flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-border/50 flex flex-col bg-secondary/10">
        <div className="p-4 border-b border-border/50">
          <h2 className="font-bold text-xl mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Active Contact Item */}
          <div className="p-4 border-b border-border/50 bg-primary/5 cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {chatPartner.charAt(0)}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full"></div>
              </div>
              <div>
                <h4 className="font-semibold text-sm">{chatPartner}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1">Pouvez-vous passer au cabinet...</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">10:52</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Header */}
        <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-secondary/10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {chatPartner.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-foreground">{chatPartner}</h3>
              <p className="text-xs text-emerald-600 font-medium">En ligne</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Phone className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
            <Video className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
            <MoreVertical className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {mockMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl p-4 ${
                msg.sender === 'me' 
                  ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                  : 'bg-secondary text-foreground rounded-tl-sm border border-border/50'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className={`text-[10px] mt-2 block ${msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-border/50">
          <div className="flex items-center gap-2">
            <button className="p-3 text-muted-foreground hover:text-primary transition-colors bg-secondary/50 rounded-xl">
              <FileSymlink className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && message.trim()) {
                  // TODO: implement send logic linked to API
                  setMessage('');
                }
              }}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-secondary/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button 
              className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
              onClick={() => {
                if (message.trim()) setMessage('');
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}