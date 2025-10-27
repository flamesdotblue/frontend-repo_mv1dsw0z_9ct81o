import { useMemo, useState } from 'react';
import Header from './components/Header';
import ProfileForm from './components/ProfileForm';
import JDAnalyzer from './components/JDAnalyzer';
import AutoApplyPanel from './components/AutoApplyPanel';
import ResumeUpload from './components/ResumeUpload';

export default function App() {
  const [profile, setProfile] = useState({});
  const [jdText, setJdText] = useState('');
  const [resumeId, setResumeId] = useState(null);

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
          <h2 className="text-lg font-semibold">Natural, human-like applications</h2>
          <p className="mt-1 text-sm text-gray-600">
            Upload your resume, paste a job description, and plan safe, human-paced applies that vary wording and timing so they feel natural.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileForm onChange={setProfile} />
          <JDAnalyzer jdText={jdText} onChange={setJdText} />
        </div>

        <ResumeUpload onSelect={setResumeId} />
        <AutoApplyPanel profile={profile} jdKeywords={jdKeywords} resumeId={resumeId} />

        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-2">How it keeps things natural</h3>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Rotates phrasing and varies sentence structures based on the JD.</li>
            <li>Adds human-like pauses, time windows, and daily apply limits.</li>
            <li>Randomizes safe ranges for delays and avoids burst patterns.</li>
          </ul>
          <p className="mt-3 text-xs text-gray-500">Note: This demo plans applications and attaches your uploaded resume. Live board integrations can be added on request.</p>
        </section>
      </main>
    </div>
  );
}
