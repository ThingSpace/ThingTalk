"use client";

import { useState, useEffect, useRef } from 'react';
import { trpc } from '@utils/trpc';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Textarea } from '@components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Label } from '@components/ui/Label';
import { ChatFeedback } from '@components/ui/ChatFeedback';
import { motion, AnimatePresence } from 'framer-motion';
import { BiSend, BiBrain, BiTime, BiHeart, BiStar, BiArrowBack, BiGlobe } from 'react-icons/bi';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAtom } from 'jotai';
import { showToastAtom, toastIntentAtom, toastMessageAtom } from '@utils/store';

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

function ChatNav() {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
      <button
        className="flex items-center gap-2 text-white hover:text-blue-100 font-semibold"
        onClick={() => router.replace('/chat/session')}
      >
        <BiArrowBack className="text-lg" />
        Back
      </button>
      <div className="flex items-center gap-4">
        <a
          href="https://athing.space/resources"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-white hover:text-blue-100 font-semibold transition-colors"
        >
          <BiBrain className="text-lg" />
          Resources
        </a>
        <a
          href="https://athing.space/help"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-white hover:text-blue-100 font-semibold transition-colors"
        >
          <BiHeart className="text-lg" />
          Help
        </a>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [displayToast, setDisplayToast] = useAtom(showToastAtom);
  const [, setToastIntent] = useAtom(toastIntentAtom);
  const [, setToastMessage] = useAtom(toastMessageAtom);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extended, setExtended] = useState(false);
  const [customExtend, setCustomExtend] = useState('');

  // Query to fetch session data when sessionId is available
  const { data: sessionData } = trpc.chat.getSession.useQuery(
    sessionId!,
    { 
      enabled: !!sessionId
    }
  );

  // Load session messages when session data is available
  useEffect(() => {
    if (sessionData?.messages) {
      const sessionMessages = sessionData.messages.map((msg: any) => ({
        text: msg.text,
        isUser: msg.isUser,
        timestamp: msg.createdAt
      }));
      setMessages(sessionMessages);
    }
  }, [sessionData]);

  const { mutate: sendMessage } = trpc.chat.sendMessage.useMutation({
    onSuccess: (data: any) => {
      setMessages((prev) => [...prev, { 
        text: data.aiResponse.text, 
        isUser: false,
        timestamp: new Date()
      }]);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
      setIsLoading(false);
    },
  });

  const { mutate: submitFeedback } = trpc.chat.submitFeedback.useMutation({
    onSuccess: () => {
      alert('Thank you for your feedback!');
    },
    onError: (error) => {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || !message.trim() || isLoading) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { 
      text: message, 
      isUser: true,
      timestamp: new Date()
    }]);
    await sendMessage({ sessionId, text: message });
    setMessage('');
  };

  const handleFeedbackSubmit = async (rating: number, comment?: string) => {
    if (!sessionId) return;
    submitFeedback({ sessionId, rating, comment }, {
      onSuccess: () => {
        setToastIntent('success');
        setToastMessage('Thank you for your feedback!');
        setDisplayToast(true);
        setShowFeedback(false);
        router.replace('/chat/aftercare');
      },
      onError: (error) => {
        setToastIntent('error');
        setToastMessage('Failed to submit feedback. Please try again.');
        setDisplayToast(true);
        setShowFeedback(false);
        router.replace('/chat/aftercare');
      },
    });
  };

  const handleFeedbackCancel = () => {
    setShowFeedback(false);
    router.replace('/chat/aftercare');
  };

  const handleEndSession = () => {
    router.replace('/chat/session');
    setMessages([]);
    setMessage('');
  };

  const handleAftercare = () => {
    router.replace('/chat/aftercare');
  };

  // Auto-resize textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };
  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  useEffect(() => {
    if (!sessionId) {
      router.replace('/chat/session');
    }
  }, [sessionId, router]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate and update remaining time
  useEffect(() => {
    if (!sessionData?.duration || !sessionData?.startTime) return;
    const durationMs = sessionData.duration * 60 * 1000;
    const start = new Date(sessionData.startTime).getTime();
    const end = start + durationMs;

    const update = () => {
      const now = Date.now();
      const left = Math.max(0, end - now);
      setRemaining(left);
      if (left === 0) setSessionEnded(true);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [sessionData]);

  // Format remaining time as MM:SS
  const formatRemaining = (ms: number | null) => {
    if (ms === null) return '--:--';
    const totalSec = Math.ceil(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // In the timer effect, show the modal when 5 minutes left and not already extended
  useEffect(() => {
    if (
      remaining !== null &&
      remaining <= 5 * 60 * 1000 &&
      remaining > 4.98 * 60 * 1000 && // Only trigger once
      !showExtendModal &&
      !extended &&
      !sessionEnded
    ) {
      setShowExtendModal(true);
    }
  }, [remaining, showExtendModal, extended, sessionEnded]);

  if (!sessionId) {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-teal-100 font-sans">
      <ChatNav />
      {/* Session header sticky below nav */}
      <div className="sticky top-[56px] z-20 px-6 py-3 bg-white/80 shadow-sm border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
          {/* Left: Status */}
          <div className="flex items-center gap-3 sm:w-1/3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="font-semibold text-gray-700 text-base">Active Chat Session</span>
          </div>
          {/* Center: Timer */}
          <div className="flex justify-center sm:w-1/3">
            {remaining !== null && (
              <span className={`px-3 py-1 rounded-full text-sm font-mono font-semibold shadow-sm transition-colors duration-300 ${
                remaining > 5 * 60 * 1000
                  ? 'bg-blue-100 text-blue-700'
                  : remaining > 0
                  ? 'bg-yellow-100 text-yellow-700 animate-pulse'
                  : 'bg-red-100 text-red-700 animate-pulse'
              }`}>
                Time left: {formatRemaining(remaining)}
              </span>
            )}
          </div>
          {/* Right: End Session Button */}
          <div className="flex justify-end sm:w-1/3">
            <Button
              styles="default"
              className="px-4 py-1 rounded-full text-sm"
              onClick={() => setSessionEnded(true)}
              disabled={sessionEnded}
            >
              End Session Now
            </Button>
          </div>
        </div>
      </div>
      {/* Chat area scrolls between sticky header and input */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-4 space-y-4 bg-gradient-to-b from-white/80 to-blue-50">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-end gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              aria-label={msg.isUser ? 'Your message' : 'AI message'}
            >
              {/* Avatar */}
              {!msg.isUser && (
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-md">
                  <BiBrain className="text-xl text-white" />
                </div>
              )}
              <div className="max-w-[85%] sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                <div
                  className={`rounded-2xl px-5 py-3 shadow-md text-base leading-relaxed break-words ${
                    msg.isUser
                      ? 'bg-gradient-to-r from-blue-200 to-teal-200 text-gray-800 rounded-br-md'
                      : 'bg-white/90 text-gray-700 border border-gray-100 rounded-bl-md'
                  }`}
                >
                  <div className='prose prose-sm max-w-none text-inherit'><ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown></div>
                </div>
                {msg.timestamp && (
                  <p className={`text-xs mt-1 px-1 ${msg.isUser ? 'text-blue-500' : 'text-gray-400'}`}>{formatTime(msg.timestamp)}</p>
                )}
              </div>
              {/* User avatar */}
              {msg.isUser && (
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center shadow-md">
                  <span className="text-xs text-white font-semibold">You</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-3 justify-start"
            aria-label="AI is typing"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-md">
              <BiBrain className="text-xl text-white" />
            </div>
            <div className="max-w-[85%] sm:max-w-lg md:max-w-xl lg:max-w-2xl">
              <div className="bg-white/90 text-gray-700 border border-gray-100 rounded-2xl px-5 py-3 shadow-md flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-400 text-sm">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input bar sticky at bottom */}
      <div className="sticky bottom-0 z-30 border-t border-gray-100 bg-white/90 px-4 py-3 shadow-lg rounded-b-2xl">
        <form onSubmit={handleSubmit} className="flex gap-3 items-center w-full">
          <Textarea
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 resize-none border border-gray-200 focus:border-blue-400 focus:ring-blue-200 rounded-xl bg-white/80 text-base text-gray-700 min-h-[44px] max-h-[120px]"
            rows={1}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isLoading || sessionEnded}
            ref={textareaRef}
            aria-label="Message input"
          />
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="flex items-center">
            <Button
              styles="exotic"
              width="fit"
              type="submit"
              disabled={!message.trim() || isLoading || sessionEnded}
              className="px-5 py-3 bg-gradient-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500 text-white shadow-md rounded-xl flex items-center justify-center"
              aria-label="Send message"
            >
              <BiSend className="text-lg" />
            </Button>
          </motion.div>
        </form>
      </div>
      {/* Session Ended Modal */}
      <AnimatePresence>
        {sessionEnded && !showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
              <BiTime className="text-4xl text-blue-400 mb-2" />
              <h2 className="text-xl font-bold mb-2 text-gray-800">Session Ended</h2>
              <p className="text-gray-600 mb-6 text-center">Your chat session has ended. What would you like to do next?</p>
              <div className="flex flex-col gap-3 w-full mt-2">
                <Button
                  styles="exotic"
                  onClick={() => setShowFeedback(true)}
                  className="rounded-full px-6 py-2 w-full"
                >
                  Give Feedback
                </Button>
                <Button
                  styles="default"
                  onClick={handleAftercare}
                  className="rounded-full px-6 py-2 w-full"
                >
                  Aftercare & Resources
                </Button>
                <Button
                  styles="default"
                  onClick={() => router.replace('/chat/session')}
                  className="rounded-full px-6 py-2 w-full"
                >
                  Start New Session
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Feedback Modal */}
      <AnimatePresence>
        {sessionEnded && showFeedback && (
          <ChatFeedback
            sessionId={sessionId!}
            onSubmit={handleFeedbackSubmit}
            onClose={handleFeedbackCancel}
          />
        )}
      </AnimatePresence>
      {/* Extend Session Modal */}
      <AnimatePresence>
        {showExtendModal && !sessionEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
              <BiTime className="text-4xl text-blue-400 mb-2" />
              <h2 className="text-xl font-bold mb-2 text-gray-800">Almost out of time</h2>
              <p className="text-gray-600 mb-6 text-center">You have 5 minutes left in your session. Would you like to extend your session?</p>
              <div className="flex gap-2 mb-4">
                {[5, 10, 15].map((min) => (
                  <Button
                    key={min}
                    styles="exotic"
                    onClick={() => {
                      setShowExtendModal(false);
                      setExtended(true);
                      if (sessionData?.duration) {
                        sessionData.duration += min;
                        setRemaining((r) => (r !== null ? r + min * 60 * 1000 : null));
                      }
                    }}
                    className="rounded-full px-4 py-2"
                  >
                    +{min} min
                  </Button>
                ))}
              </div>
              <form
                className="flex gap-2 items-center mb-4"
                onSubmit={e => {
                  e.preventDefault();
                  const min = parseInt(customExtend, 10);
                  if (!isNaN(min) && min > 0) {
                    setShowExtendModal(false);
                    setExtended(true);
                    if (sessionData?.duration) {
                      sessionData.duration += min;
                      setRemaining((r) => (r !== null ? r + min * 60 * 1000 : null));
                    }
                  }
                }}
              >
                <Input
                  id="custom-extend"
                  type="number"
                  label=""
                  value={customExtend}
                  onChange={e => setCustomExtend(e.target.value)}
                  className="w-20 text-center"
                />
                <Button
                  styles="default"
                  type="submit"
                  className="rounded-full px-4 py-2"
                  disabled={!customExtend || isNaN(Number(customExtend)) || Number(customExtend) <= 0}
                >
                  Add
                </Button>
              </form>
              <Button
                styles="default"
                onClick={() => setShowExtendModal(false)}
                className="rounded-full px-6 py-2"
              >
                Let Session End
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}