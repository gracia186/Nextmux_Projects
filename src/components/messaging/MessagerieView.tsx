import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Send, MessageSquare, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Message } from '../../types';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';

interface Contact {
  id: number;
  name: string;
  sub?: string;
}

interface MessagingApi {
  conversations: () => Promise<{ data: Record<string, Message[]> }>;
  conversation: (userId: number) => Promise<{ data: Message[] }>;
  sendMessage: (receiverId: number, contenu: string) => Promise<{ data: Message }>;
}

export function MessagerieView({ api, contacts }: { api: MessagingApi; contacts: Contact[] }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Record<string, Message[]> | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  function loadConversations() {
    api.conversations().then((res) => {
      setConversations(res.data);
      setActiveId((prev) => {
        if (prev !== null) return prev;
        const firstId = Object.keys(res.data)[0];
        return firstId ? Number(firstId) : null;
      });
    });
  }

  useEffect(loadConversations, []);

  useEffect(() => {
    if (activeId === null) return;
    api.conversation(activeId).then((res) => setMessages(res.data));
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || activeId === null) return;
    const res = await api.sendMessage(activeId, text);
    setMessages((prev) => [...prev, res.data]);
    setText('');
    loadConversations();
  }

  if (conversations === null) return null;

  const contactIds = Object.keys(conversations);
  const contactedIds = new Set(contactIds.map(Number));
  const startableContacts = contacts.filter((c) => !contactedIds.has(c.id));

  if (contactIds.length === 0) {
    if (contacts.length === 0) {
      return (
        <Card className="card" index={0}>
          <EmptyState icon={<MessageSquare size={40} />} title="Aucune conversation" description="Vos échanges apparaîtront ici une fois qu'un message aura été envoyé." />
        </Card>
      );
    }
    return (
      <Card className="card" index={0}>
        <h3 style={{ marginBottom: 4 }}>Démarrer une conversation</h3>
        <p className="page-subtitle" style={{ marginBottom: 16 }}>Choisissez un contact pour envoyer votre premier message.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {contacts.map((c) => (
            <button key={c.id} type="button" className="nav-link ring-hover" style={{ width: '100%', cursor: 'pointer' }} onClick={() => setActiveId(c.id)}>
              <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{c.name.slice(0, 2).toUpperCase()}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                {c.sub && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.sub}</div>}
              </div>
            </button>
          ))}
        </div>
        {activeId !== null && (
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <input
              autoFocus
              placeholder="Écrire votre premier message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 10, padding: '10px 12px', color: 'var(--text)' }}
            />
            <Button type="submit" size="sm" icon={<Send size={14} />}>Envoyer</Button>
          </form>
        )}
      </Card>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, height: 'calc(100vh - 180px)' }}>
      <Card className="card" index={0} style={{ padding: 10, overflowY: 'auto', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px 10px' }}>
          <span className="page-subtitle">Conversations</span>
          {startableContacts.length > 0 && (
            <button type="button" className="icon-btn" style={{ width: 26, height: 26 }} aria-label="Nouveau message" onClick={() => setPickerOpen((v) => !v)}>
              {pickerOpen ? <X size={13} /> : <Plus size={13} />}
            </button>
          )}
        </div>

        {pickerOpen && (
          <div style={{ marginBottom: 8, borderBottom: '1px solid var(--glass-border)', paddingBottom: 8 }}>
            {startableContacts.map((c) => (
              <button
                key={c.id}
                type="button"
                className="nav-link"
                style={{ width: '100%', cursor: 'pointer' }}
                onClick={() => {
                  setActiveId(c.id);
                  setMessages([]);
                  setPickerOpen(false);
                }}
              >
                <div className="avatar" style={{ width: 28, height: 28, fontSize: 10.5 }}>{c.name.slice(0, 2).toUpperCase()}</div>
                <div style={{ textAlign: 'left', fontSize: 12.5 }}>{c.name}</div>
              </button>
            ))}
          </div>
        )}

        {contactIds.map((id) => {
          const thread = conversations[id];
          const last = thread[thread.length - 1];
          const contact = last.sender_id === Number(id) ? last.sender : last.receiver;
          const unread = thread.filter((m) => !m.lu && m.receiver_id === user?.id).length;
          return (
            <div
              key={id}
              onClick={() => setActiveId(Number(id))}
              className="nav-link"
              style={{ cursor: 'pointer', background: Number(id) === activeId ? 'rgba(96,165,250,0.14)' : undefined, marginBottom: 4 }}
            >
              <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>
                {(contact?.name ?? '?').slice(0, 2).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact?.name ?? 'Contact'}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{last.contenu}</div>
              </div>
              {unread > 0 && <span className="nav-badge">{unread}</span>}
            </div>
          );
        })}
      </Card>

      <Card className="card" index={1} style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((m) => {
            const mine = m.sender_id === user?.id;
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: mine ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  padding: '9px 13px',
                  borderRadius: 14,
                  fontSize: 13.5,
                  background: mine ? 'var(--gradient-brand)' : 'rgba(255,255,255,0.05)',
                  color: mine ? '#fff' : 'var(--text)',
                  border: mine ? 'none' : '1px solid var(--glass-border)',
                }}
              >
                {m.contenu}
              </div>
            );
          })}
          {messages.length === 0 && <p className="page-subtitle">Aucun message pour l'instant. Dites bonjour 👋</p>}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, padding: 14, borderTop: '1px solid var(--glass-border)' }}>
          <input
            placeholder="Écrire un message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 10, padding: '10px 12px', color: 'var(--text)' }}
          />
          <button type="submit" className="btn btn-primary btn-sm" aria-label="Envoyer"><Send size={14} /></button>
        </form>
      </Card>
    </div>
  );
}
