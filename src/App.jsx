import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import ResumeUpload from './components/ResumeUpload';
import JDAnalyzer from './components/JDAnalyzer';
import AutoApplyPanel from './components/AutoApplyPanel';

// Minimal English stopwords for keyword extraction
const STOPWORDS = new Set([
  'a','an','the','and','or','but','if','then','else','when','at','by','for','in','of','on','to','from','up','down','with','as','is','are','was','were','be','been','being','it','its','that','this','these','those','you','your','yours','we','our','ours','they','their','theirs','i','me','my','mine','he','she','him','her','his','hers','do','does','did','doing','have','has','had','having','not','no','yes','can','could','should','would','may','might','will','just'
]);

export default function App() {
  const [resumes, setResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [jdText, setJdText] = useState('');

  const [settings, setSettings] = useState({
    boards: ['linkedin'],
    minScore: 70,
    paraphraseLevel: 1,
    dailyCap: 10,
    windowStart: '09:00',
    windowEnd: '18:00',
  });

  const keywords = useMemo(() => extractKeywords(jdText, 25), [jdText]);

  const planned = useMemo(() => {
    // Create a light local plan preview based on settings
    if (!activeResumeId || settings.boards.length === 0) return [];
    const now = new Date();
    const [startH, startM] = settings.windowStart.split(':').map(Number);
    const [endH, endM] = settings.windowEnd.split(':').map(Number);
    const start = new Date(now);
    start.setHours(startH, startM, 0, 0);
    const end = new Date(now);
    end.setHours(endH, endM, 0, 0);

    const slots = [];
    const total = Math.min(settings.dailyCap, settings.boards.length * 3);
    for (let i = 0; i < total; i++) {
      const board = settings.boards[i % settings.boards.length];
      const t = new Date(start.getTime() + Math.random() * Math.max(1, end.getTime() - start.getTime()));
      slots.push({
        board,
        time: t.toISOString(),
        minScore: settings.minScore,
        paraphraseLevel: settings.paraphraseLevel,
      });
    }
    return slots.sort((a, b) => new Date(a.time) - new Date(b.time));
  }, [activeResumeId, settings]);

  const handleUpload = (file, dataBuffer) => {
    // Store locally for demo: id, name, type, size, and a blob for download
    const id = crypto.randomUUID();
    let blob;
    if (dataBuffer instanceof ArrayBuffer) {
      blob = new Blob([dataBuffer], { type: file.type || 'application/octet-stream' });
    } else if (dataBuffer instanceof Blob) {
      blob = dataBuffer;
    } else {
      blob = new Blob([], { type: file.type || 'application/octet-stream' });
    }
    const url = URL.createObjectURL(blob);
    const next = { id, name: file.name, type: file.type, size: file.size, url };
    setResumes((prev) => [next, ...prev]);
    setActiveResumeId(id);
  };

  const handleDownload = (resume) => {
    if (!resume?.url) return;
    const link = document.createElement('a');
    link.href = resume.url;
    link.download = resume.name || 'resume';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="rounded-2xl p-6 bg-indigo-50/60 border border-indigo-100">
          <p className="text-gray-800 text-sm">
            Tip: You can upload large resumes here — there is no client-side size limit applied in this UI. For truly unlimited sizes in production, ensure your backend and proxy also allow large payloads.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ResumeUpload
            resumes={resumes}
            onUpload={handleUpload}
            onSelect={setActiveResumeId}
            activeResumeId={activeResumeId}
            onDownload={handleDownload}
          />

          <JDAnalyzer jdText={jdText} onChange={setJdText} keywords={keywords} />
        </div>

        <AutoApplyPanel
          activeResumeId={activeResumeId}
          settings={settings}
          onSettingsChange={setSettings}
          planned={planned}
          onPlan={() => { /* Local-only preview */ }}
        />

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold">How it works</h3>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 space-y-1">
            <li>Upload and select your preferred resume version.</li>
            <li>Paste a job description to see the top keywords instantly.</li>
            <li>Configure job boards and pacing, then review the planned schedule.</li>
            <li>Hook this UI to your API to persist plans and send applications automatically.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function extractKeywords(text, topN = 25) {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+\-# ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w) && w.length > 2);

  const freq = new Map();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }));
}
