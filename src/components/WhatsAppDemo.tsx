import { useState, useEffect, useRef } from 'react';
import {
  Search, MoreVertical, Send, ArrowLeft, X, Check, CheckCheck,
  Clock, ChevronDown, CreditCard, Smartphone, Building2
} from 'lucide-react';
import PaymentGateway from './PaymentGateway';
import { TravelAssistant } from '../utils/travelAssistant';

interface Message {
  id: string;
  direction: 'in' | 'out';
  type: 'text' | 'link' | 'system';
  text: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  metadata?: {
    chips?: string[];
    cards?: Array<{
      title: string;
      subtitle: string;
      actionText: string;
      actionPayload: string;
    }>;
    linkPreview?: {
      url: string;
      title: string;
      description: string;
    };
  };
}

const WhatsAppDemo = () => {
  const [screen, setScreen] = useState<'list' | 'chat'>('list');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [showUserForm, setShowUserForm] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const assistant = useRef(new TravelAssistant());

  useEffect(() => {
    const storedSession = localStorage.getItem('wa_session_id');
    const storedUser = localStorage.getItem('wa_user');
    if (storedSession && storedUser) {
      const user = JSON.parse(storedUser);
      setSessionId(storedSession);
      setUserName(user.name);
      setUserPhone(user.phone);
      setShowUserForm(false);
      loadMessages();
    }
  }, []);

  const loadMessages = () => {
    const stored = localStorage.getItem('wa_messages');
    if (stored) {
      const parsed = JSON.parse(stored);
      setMessages(parsed.map((m: Message) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
    } else {
      const welcome: Message = {
        id: Date.now().toString(),
        direction: 'in',
        type: 'text',
        text: 'Hi! Tell me what you need 🙂',
        timestamp: new Date(),
        metadata: {
          chips: ['Book a stay', 'Modify booking', 'Cancel booking', 'Help']
        }
      };
      setMessages([welcome]);
      localStorage.setItem('wa_messages', JSON.stringify([welcome]));
    }
  };

  const saveMessages = (msgs: Message[]) => {
    localStorage.setItem('wa_messages', JSON.stringify(msgs));
  };

  const startSession = () => {
    if (!userName.trim() || !userPhone.trim()) return;
    const newSessionId = `S-${Date.now()}`;
    setSessionId(newSessionId);
    localStorage.setItem('wa_session_id', newSessionId);
    localStorage.setItem('wa_user', JSON.stringify({ name: userName, phone: userPhone }));
    setShowUserForm(false);
    loadMessages();
  };

  const resetDemo = () => {
    localStorage.clear();
    setMessages([]);
    setSessionId(null);
    setUserName('');
    setUserPhone('');
    setShowUserForm(true);
    setScreen('list');
    assistant.current = new TravelAssistant();
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollDown(!isNearBottom && messages.length > 0);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom('smooth'), 100);
    }
  }, [messages]);

  const updateMessageStatus = (messageId: string, status: Message['status']) => {
    setMessages(prev => {
      const updated = prev.map(m =>
        m.id === messageId ? { ...m, status } : m
      );
      saveMessages(updated);
      return updated;
    });
  };

  const sendMessage = async (text: string, isChipAction = false) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      direction: 'out',
      type: 'text',
      text: text.trim(),
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => {
      const updated = [...prev, userMessage];
      saveMessages(updated);
      return updated;
    });
    setInputText('');

    setTimeout(() => updateMessageStatus(userMessage.id, 'sent'), 200);
    setTimeout(() => updateMessageStatus(userMessage.id, 'delivered'), 700);

    setIsTyping(true);

    const response = await assistant.current.processMessage({
      session_id: sessionId || '',
      user: { phone: userPhone, name: userName },
      message: text.trim()
    });

    setTimeout(() => {
      setIsTyping(false);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        direction: 'in',
        type: response.ui?.linkPreview ? 'link' : 'text',
        text: response.reply,
        timestamp: new Date(),
        metadata: response.ui
      };

      setMessages(prev => {
        const updated = [...prev, botMessage];
        saveMessages(updated);
        return updated;
      });

      updateMessageStatus(userMessage.id, 'read');

      if (response.ui?.linkPreview) {
        setCurrentPaymentId(response.ui.linkPreview.url.split('/').pop() || null);
      }
    }, isChipAction ? 800 : 1500);
  };

  const handleSend = () => {
    sendMessage(inputText);
  };

  const handleChipClick = (chip: string) => {
    sendMessage(chip, true);
  };

  const handleCardAction = (actionPayload: string, actionText: string) => {
    sendMessage(actionPayload, true);
  };

  const handlePaymentComplete = (status: 'SUCCESS' | 'FAIL') => {
    if (!currentPaymentId) return;

    setShowPayment(false);

    const systemMessage = status === 'SUCCESS'
      ? `PAYMENT_SUCCESS ${currentPaymentId}`
      : `PAYMENT_FAILED ${currentPaymentId}`;

    sendMessage(systemMessage, true);
    setCurrentPaymentId(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const renderMessageStatus = (status?: Message['status']) => {
    if (!status) return null;

    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-slate-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-slate-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-slate-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-teal-400" />;
    }
  };

  if (showUserForm) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-3xl">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-800/50">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Travel Assistant</h3>
            <p className="text-slate-400 text-sm">Enter your details to start chatting</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20"
                placeholder="+971 50 000 0000"
              />
            </div>

            <button
              onClick={startSession}
              disabled={!userName.trim() || !userPhone.trim()}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl hover:from-teal-400 hover:to-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            onClick={resetDemo}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 hover:bg-slate-800 transition-all text-sm font-semibold"
          >
            Reset Demo
          </button>

          <div className="flex-1 max-w-2xl">
            <p className="text-sm text-slate-400 mb-2 text-center md:text-right">Try these sample queries:</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              <button
                onClick={() => {
                  if (screen === 'list') setScreen('chat');
                  setInputText('Book a private room in Place 2 next weekend for 2');
                }}
                className="px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-lg text-xs text-teal-400 transition-colors"
              >
                Book a stay
              </button>
              <button
                onClick={() => {
                  if (screen === 'list') setScreen('chat');
                  setInputText('Cancel booking BK-' + Date.now().toString().slice(-6));
                }}
                className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg text-xs text-orange-400 transition-colors"
              >
                Cancel booking
              </button>
              <button
                onClick={() => {
                  if (screen === 'list') setScreen('chat');
                  setInputText("What's the cancellation policy?");
                }}
                className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-xs text-blue-400 transition-colors"
              >
                Ask about policy
              </button>
              <button
                onClick={() => {
                  if (screen === 'list') setScreen('chat');
                  setInputText('Modify my booking to add 1 guest');
                }}
                className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs text-purple-400 transition-colors"
              >
                Modify booking
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-[420px] bg-slate-900 rounded-[3rem] shadow-2xl border-8 border-slate-800 overflow-hidden">
            {screen === 'list' ? (
              <div className="bg-slate-800 h-[700px] flex flex-col">
                <div className="bg-teal-600 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-white font-semibold text-xl">Chats</h2>
                  <div className="flex items-center gap-4">
                    <Search className="w-5 h-5 text-white cursor-pointer" />
                    <MoreVertical className="w-5 h-5 text-white cursor-pointer" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-900">
                  <div
                    onClick={() => setScreen('chat')}
                    className="flex items-center gap-4 px-4 py-4 hover:bg-slate-800/50 cursor-pointer border-b border-slate-800"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white">Travel Assistant</h3>
                        <span className="text-xs text-slate-400">now</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-400 truncate">Hi! Tell me what you need 🙂</p>
                        <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0 ml-2">
                          <span className="text-xs text-white font-semibold">1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[700px] flex flex-col bg-slate-900">
                <div className="bg-teal-600 px-4 py-3 flex items-center gap-3 shadow-lg">
                  <button onClick={() => setScreen('list')} className="p-1">
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Travel Assistant</h3>
                    <p className="text-xs text-teal-100">{isTyping ? 'typing...' : 'online'}</p>
                  </div>
                  <MoreVertical className="w-5 h-5 text-white cursor-pointer" />
                </div>

                <div
                  ref={chatRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto px-4 py-4 bg-slate-950 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAyIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] relative"
                  style={{ backgroundSize: '40px 40px' }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-slate-800/70 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-slate-300">
                      Today
                    </div>
                  </div>

                  {messages.map((message) => (
                    <div key={message.id} className={`mb-3 flex ${message.direction === 'out' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${message.direction === 'out' ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-lg px-3 py-2 ${
                          message.direction === 'out'
                            ? 'bg-teal-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-100 rounded-bl-none'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-[10px] opacity-70">{formatTime(message.timestamp)}</span>
                            {message.direction === 'out' && renderMessageStatus(message.status)}
                          </div>
                        </div>

                        {message.metadata?.linkPreview && (
                          <div
                            onClick={() => {
                              setCurrentPaymentId(message.metadata?.linkPreview?.url.split('/').pop() || null);
                              setShowPayment(true);
                            }}
                            className="mt-2 bg-slate-800 rounded-lg p-3 border border-slate-700 cursor-pointer hover:bg-slate-750 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard className="w-4 h-4 text-teal-400" />
                              <span className="text-xs font-semibold text-teal-400">Payment Link</span>
                            </div>
                            <h4 className="font-semibold text-white text-sm mb-1">{message.metadata.linkPreview.title}</h4>
                            <p className="text-xs text-slate-400">{message.metadata.linkPreview.description}</p>
                          </div>
                        )}

                        {message.metadata?.cards && message.metadata.cards.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.metadata.cards.map((card, idx) => (
                              <div key={idx} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                                <h4 className="font-semibold text-white text-sm mb-1">{card.title}</h4>
                                <p className="text-xs text-slate-400 mb-2">{card.subtitle}</p>
                                <button
                                  onClick={() => handleCardAction(card.actionPayload, card.actionText)}
                                  className="text-xs font-semibold text-teal-400 hover:text-teal-300"
                                >
                                  {card.actionText}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {message.metadata?.chips && message.metadata.chips.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.metadata.chips.map((chip, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleChipClick(chip)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-full border border-slate-600 transition-colors"
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="mb-3 flex justify-start">
                      <div className="bg-slate-800 text-slate-100 rounded-lg rounded-bl-none px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>

                {showScrollDown && (
                  <button
                    onClick={() => scrollToBottom('smooth')}
                    className="absolute bottom-20 right-8 bg-teal-600 hover:bg-teal-500 text-white rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                )}

                <div className="bg-slate-800 px-3 py-2 flex items-end gap-2">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message"
                    className="flex-1 bg-slate-900 text-white px-4 py-2 rounded-full resize-none focus:outline-none text-sm max-h-32"
                    rows={1}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 transition-colors flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {showPayment && currentPaymentId && (
          <PaymentGateway
            paymentId={currentPaymentId}
            amount={assistant.current.getPendingPaymentAmount(currentPaymentId)}
            onClose={() => setShowPayment(false)}
            onComplete={handlePaymentComplete}
          />
        )}
      </div>
    </div>
  );
};

export default WhatsAppDemo;
