import { useMemo, useState } from 'react';
import Header from './components/Header';
import ProfileForm from './components/ProfileForm';
import JDAnalyzer from './components/JDAnalyzer';
import TailoredResume from './components/TailoredResume';

export default function App() {
  const [profile, setProfile] = useState({});
  const [jdText, setJdText] = useState('');

  const jdKeywords = useMemo(() => {
    const text = jdText.toLowerCase().replace(/[^a-z0-9+.# ]/g, ' ');
    const parts = text.split(/\s+/).filter(Boolean);
    const counts = parts.reduce((acc, w) => {
      acc[w] = (acc[w] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([term, count]) => ({ term, count }));
  }, [jdText]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Automate your job applications</h2>
          <p className="mt-1 text-sm text-gray-600">
            Paste a job description, enter your profile, and instantly generate a tailored resume optimized to pass keyword screens and increase callback rates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileForm onChange={setProfile} />
          <JDAnalyzer jdText={jdText} onChange={setJdText} />
        </div>

        <TailoredResume profile={profile} jdKeywords={jdKeywords} />

        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-2">What comes next</h3>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Connect job boards and ATS portals for one-click applies.</li>
            <li>Auto-fill forms using your profile and resume.</li>
            <li>Track submissions, statuses, and callbacks in a dashboard.</li>
          </ul>
          <p className="mt-3 text-xs text-gray-500">Note: This demo focuses on resume tailoring. Portal integrations can be added on request.</p>
        </section>
      </main>
    </div>
  );
}
