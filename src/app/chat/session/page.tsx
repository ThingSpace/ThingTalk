"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@utils/trpc';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Label } from '@components/ui/Label';
import { AnimatePresence, motion } from 'framer-motion';
import { BiTime, BiHeart, BiLogIn, BiUserPlus } from 'react-icons/bi';
import LoginForm from '@components/auth/LoginForm';
import SignupForm from '@components/auth/SignupForm';

const MoodOptions = [
  { value: 'anxious', label: 'Anxious', emoji: '😰' },
  { value: 'happy', label: 'Happy', emoji: '😊' },
  { value: 'sad', label: 'Sad', emoji: '😢' },
  { value: 'angry', label: 'Angry', emoji: '😠' },
  { value: 'confused', label: 'Confused', emoji: '😕' },
  { value: 'lonely', label: 'Lonely', emoji: '🥺' },
  { value: 'hopeful', label: 'Hopeful', emoji: '✨' }
];

const steps = [
  'Authenticate',
  'Mood',
  'Duration',
  'Review',
];

export default function ChatSessionStepper() {
  const [step, setStep] = useState(0);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mood, setMood] = useState('');
  const [duration, setDuration] = useState(30);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const router = useRouter();

  const { mutate: createSession } = trpc.chat.createSession.useMutation({
    onSuccess: (data: any) => {
      setIsCreatingSession(false);
      router.push(`/chat?sessionId=${data.id}`);
    },
    onError: () => setIsCreatingSession(false),
  });

  const { data: user, isLoading: isUserLoading } = trpc.user.me.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      setIsAuthenticated(true);
      setStep(1);
    }
  }, [isUserLoading, user]);

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setStep(1);
  };

  const handleCreateSession = () => {
    setIsCreatingSession(true);
    createSession({ mood, duration });
  };

  const Stepper = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, idx) => (
        <div key={label} className="flex items-center gap-1">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white transition-all duration-300 ${
            idx < step ? 'bg-blue-400' : idx === step ? 'bg-purple-600' : 'bg-black'
          }`}>
            {idx + 1}
          </div>
          {idx < steps.length - 1 && <div className="w-8 h-1 bg-black rounded" />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-clouds-pattern p-4">
      <div className="w-full max-w-xl mx-auto">
        <Stepper />
        <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Step 0: Auth */}
            {step === 0 && !isUserLoading && !isAuthenticated && (
              <div>
                <div className="flex justify-center mb-6">
                  <button
                    className={`px-6 py-2 rounded-t-lg font-bold transition-all duration-200 ${authTab === 'login' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                    onClick={() => setAuthTab('login')}
                  >
                    <BiLogIn className="inline mr-2" /> Login
                  </button>
                  <button
                    className={`px-6 py-2 rounded-t-lg font-bold transition-all duration-200 ${authTab === 'signup' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                    onClick={() => setAuthTab('signup')}
                  >
                    <BiUserPlus className="inline mr-2" /> Register
                  </button>
                </div>
                <div className="bg-white rounded-b-lg p-4 shadow-inner">
                  {authTab === 'login' ? (
                    <LoginForm onSuccess={handleAuthSuccess} />
                  ) : (
                    <>
                      <div className="mb-4 text-center text-blue-700 text-sm font-medium">
                        For your privacy, we will generate a random username for you. You do not need to pick one your identity stays anonymous!
                      </div>
                      <SignupForm onSuccess={handleAuthSuccess} />
                    </>
                  )}
                </div>
              </div>
            )}
            {/* Step 1: Mood */}
            {step === 1 && (
              <div>
                <Label className="text-xl font-semibold text-gray-800 mb-4 block text-center">
                  How are you feeling today?
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {MoodOptions.map((option) => (
                    <motion.div
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        styles={mood === option.value ? 'exotic' : 'default'}
                        width="full"
                        onClick={() => setMood(option.value)}
                        className={`h-20 flex-col gap-2 transition-all duration-300 ${
                          mood === option.value 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                            : 'hover:shadow-md'
                        }`}
                      >
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="text-sm font-medium">{option.label}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <Button onClick={goBack} styles="default">Back</Button>
                  <Button onClick={goNext} styles="exotic" disabled={!mood}>Next</Button>
                </div>
              </div>
            )}
            {/* Step 2: Duration */}
            {step === 2 && (
              <div>
                <Label className="text-xl font-semibold text-gray-800 mb-4 block text-center">
                  How long would you like your session to last?
                </Label>
                <div className="flex items-center justify-center gap-4 mb-8">
                  <BiTime className="text-2xl text-gray-600" />
                  <Input
                    id="duration"
                    type="number"
                    label=""
                    value={duration}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(Number(e.target.value))}
                    className="text-center text-lg font-semibold"
                  />
                  <span className="text-gray-600 font-medium">minutes</span>
                </div>
                <div className="flex justify-between">
                  <Button onClick={goBack} styles="default">Back</Button>
                  <Button onClick={goNext} styles="exotic" disabled={duration < 1}>Next</Button>
                </div>
              </div>
            )}
            {/* Step 3: Review & Start */}
            {step === 3 && (
              <div>
                <Label className="text-xl font-semibold text-gray-800 mb-4 block text-center">
                  Review your session
                </Label>
                <div className="mb-6 text-center">
                  <div className="mb-2">Mood: <span className="font-bold">{MoodOptions.find(m => m.value === mood)?.label}</span></div>
                  <div>Duration: <span className="font-bold">{duration} minutes</span></div>
                </div>
                <div className="flex justify-between">
                  <Button onClick={goBack} styles="default">Back</Button>
                  <Button onClick={handleCreateSession} styles="exotic" disabled={isCreatingSession}>
                    {isCreatingSession ? 'Starting...' : 'Create Session'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 