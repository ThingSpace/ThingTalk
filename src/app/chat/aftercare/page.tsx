"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { BiHomeHeart, BiBookOpen, BiHelpCircle, BiHeart, BiArrowBack, BiGroup, BiAlarm, BiEditAlt, BiSpa } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

const selfCareSuggestions = [
  { icon: '🚶‍♂️', text: 'Take a gentle walk' },
  { icon: '💧', text: 'Drink a glass of water' },
  { icon: '📝', text: 'Write down your thoughts' },
  { icon: '🎧', text: 'Listen to calming music' },
  { icon: '📞', text: 'Reach out to a friend' },
  { icon: '🧘‍♀️', text: 'Try a short meditation' },
  { icon: '🌳', text: 'Spend a moment in nature' },
];

export default function AftercarePage() {
  const router = useRouter();
  const [journal, setJournal] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setJournal('');
    setTimeout(() => setShowToast(false), 2500);
  };

  const addToCalendar = () => {
    // Set event for 1 hour from now
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const format = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${format(inOneHour)}`,
      `DTEND:${format(new Date(inOneHour.getTime() + 30 * 60 * 1000))}`,
      'SUMMARY:Self-Care Reminder',
      'DESCRIPTION:Take a moment for self-care. You deserve it!',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'self-care-reminder.ics';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-clouds-pattern p-4">
      <Card className="max-w-2xl w-full shadow-2xl bg-white/90 backdrop-blur-sm border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center pb-8 rounded-t-2xl">
          <div className="flex flex-col items-center gap-3 mb-2">
            <CardTitle className="text-5xl font-bold text-white">Aftercare & Resources</CardTitle>
          </div>
          <p className="text-blue-100 text-lg font-medium">You did something good for yourself today. Take a moment to care for your mind and body. Here are some resources and next steps you might find helpful.</p>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Self-Care Suggestions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2"><BiSpa className="text-xl text-teal-400" /> Self-Care Suggestions</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selfCareSuggestions.map((item, i) => (
                <li key={i} className="flex items-center gap-3 bg-blue-50/60 rounded-lg px-4 py-2 text-gray-700 shadow-sm">
                  <span className="text-2xl" aria-hidden>{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center flex flex-col sm:flex-row gap-2 justify-center items-center">
              <Button
                styles="default"
                className="rounded-full px-6 py-2 flex items-center gap-2 mx-auto"
                onClick={() => alert('Reminder feature coming soon!')}
              >
                <BiAlarm className="text-lg" /> Set a reminder for self-care
              </Button>
              <Button
                styles="default"
                className="rounded-full px-6 py-2 flex items-center gap-2 mx-auto"
                onClick={addToCalendar}
              >
                <BiBookOpen className="text-lg" /> Add to Calendar
              </Button>
            </div>
          </div>
          {/* Resource Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2"><BiHelpCircle className="text-xl" /> Immediate Help</h2>
              <ul className="space-y-2">
                <li><a href="https://www.mentalhealth.gov/get-help/immediate-help" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">Immediate Help (US)</a></li>
                <li><a href="https://www.befrienders.org/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">International Helplines</a></li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-purple-700 mb-2 flex items-center gap-2"><BiBookOpen className="text-xl" /> Learn More</h2>
              <ul className="space-y-2">
                <li><a href="https://athing.space/resources" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline font-medium">Mental Health Resources</a></li>
                <li><a href="https://athing.space/help" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline font-medium">Get Help / Crisis Support</a></li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-teal-700 mb-2 flex items-center gap-2"><BiGroup className="text-xl" /> Community & Support</h2>
              <ul className="space-y-2">
                <li><a href="https://www.7cups.com/" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline font-medium">7 Cups (Free Online Support)</a></li>
                <li><a href="https://www.reddit.com/r/mentalhealth/" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline font-medium">Reddit: r/mentalhealth</a></li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-pink-700 mb-2 flex items-center gap-2"><BiSpa className="text-xl" /> Self-Care Tools</h2>
              <ul className="space-y-2">
                <li><a href="https://www.calm.com/" target="_blank" rel="noopener noreferrer" className="text-pink-700 hover:underline font-medium">Calm (Meditation App)</a></li>
                <li><a href="https://www.headspace.com/" target="_blank" rel="noopener noreferrer" className="text-pink-700 hover:underline font-medium">Headspace (Mindfulness)</a></li>
              </ul>
            </div>
          </div>
          {/* Journaling Prompt */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2"><BiEditAlt className="text-xl text-blue-400" /> Reflect on Your Session</h2>
            <form onSubmit={handleJournalSubmit}>
              <div className="bg-blue-50/60 rounded-lg p-4 shadow-sm">
                <p className="mb-2 text-gray-700">Take a moment to write down any thoughts, feelings, or insights you had during your session. Journaling can help you process and remember what matters most to you.</p>
                <textarea
                  className="w-full rounded-lg border border-gray-200 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 min-h-[80px]"
                  placeholder="What did you notice about yourself today? What would you like to remember?"
                  rows={4}
                  value={journal}
                  onChange={e => setJournal(e.target.value)}
                />
                <div className="text-right mt-2">
                  <Button
                    styles="default"
                    type="submit"
                    className="rounded-full px-6 py-2"
                    disabled={!journal.trim()}
                  >
                    Save Reflection
                  </Button>
                </div>
                {showToast && (
                  <div className="mt-3 text-green-700 bg-green-100 rounded-lg px-4 py-2 text-sm text-center animate-fade-in">
                    Reflection saved (just for you!)
                  </div>
                )}
              </div>
            </form>
          </div>
          <div className="text-center mt-8">
            <Button
              styles="exotic"
              className="rounded-full px-8 py-3 text-lg"
              onClick={() => router.replace('/chat/session')}
            >
              <BiArrowBack className="inline mr-2 text-xl align-middle" />
              Back to Start
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 