import { useApp, getProvider } from '../AppContext';
import { MessageCircle, BadgeCheck, Search } from 'lucide-react';
import { CategoryBadge } from '../components/CategoryBadge';
import { useState } from 'react';

export function MessagesScreen() {
  const { threads, navigate, openChat, currentThreadId } = useApp();
  const [search, setSearch] = useState('');

  const filtered = threads.filter(t => {
    const p = getProvider(t.providerId);
    return p && (p.name.toLowerCase().includes(search.toLowerCase()) || t.lastMessage.toLowerCase().includes(search.toLowerCase()));
  });

  const openThread = (providerId: string) => {
    openChat(providerId);
    navigate('chat', { providerId });
  };

  return (
    <div>
      <div className="border-b border-ink-200 bg-white sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <h1 className="font-bold text-ink-900 text-lg">Messages</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-6">
        {threads.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={28} className="text-ink-400" />
            </div>
            <h3 className="font-semibold text-ink-700">No messages yet</h3>
            <p className="text-sm text-ink-400 mt-1">Start a conversation from any profile.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[340px_1fr] gap-6">
            {/* Thread list */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-white border border-ink-200 rounded-xl px-4 py-2.5 mb-3 focus-within:border-brand-400 transition-all">
                <Search size={17} className="text-ink-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="flex-1 bg-transparent outline-none text-sm" />
              </div>
              <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden divide-y divide-ink-100">
                {filtered.map(thread => {
                  const provider = getProvider(thread.providerId);
                  if (!provider) return null;
                  return (
                    <button
                      key={thread.id}
                      onClick={() => openThread(thread.providerId)}
                      className={`w-full flex items-center gap-3 p-3.5 hover:bg-ink-50 transition-colors text-left ${currentThreadId === thread.id ? 'bg-brand-50' : ''}`}
                    >
                      <div className="relative shrink-0">
                        <img src={provider.avatar} alt={provider.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-lg shadow-sm border border-ink-100">
                          <CategoryBadge category={provider.category} size={20} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 min-w-0">
                            <h3 className="font-semibold text-ink-900 truncate text-sm">{provider.name}</h3>
                            {provider.verified && <BadgeCheck size={13} className="text-brand-500 shrink-0" fill="currentColor" stroke="white" />}
                          </div>
                          <span className="text-xs text-ink-400 shrink-0">{thread.lastTime}</span>
                        </div>
                        <p className="text-sm text-ink-500 truncate mt-0.5">{thread.lastMessage || 'Start chatting...'}</p>
                      </div>
                      {thread.unread > 0 && (
                        <span className="bg-brand-500 text-white text-xs font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shrink-0">
                          {thread.unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview / empty pane */}
            <div className="hidden lg:flex flex-col items-center justify-center bg-ink-50 rounded-2xl border border-ink-100 min-h-[500px]">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-card">
                <MessageCircle size={28} className="text-ink-300" />
              </div>
              <h3 className="font-semibold text-ink-700">Select a conversation</h3>
              <p className="text-sm text-ink-400 mt-1">Pick a chat from the left to view messages.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
