import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import ResumeUpload from './components/ResumeUpload';
import JDAnalyzer from './components/JDAnalyzer';
import AutoApplyPanel from './components/AutoApplyPanel';

// Minimal English stopwords for keyword extraction
const STOPWORDS = new Set([
  'a','an','the','and','or','but','if','then','else','when','at','by','for','in','of','on','to','from','up','down','with','as','is','are','was','were','be','been','being','it','its','that','this','these','those','you','your','yours','we','our','ours','they','their','theirs','i','me','my','mine','he','she','him','her','his','hers','do','does','did','doing','have','has','had','having','not','no','yes','can','could','should','would','may','might','will','just'
]);

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

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

  const [planned, setPlanned] = useState([]);
  const [sent, setSent] = useState([]);
  const [sending, setSending] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(false);

  const keywords = useMemo(() => extractKeywords(jdText, 25), [jdText]);

  useEffect(() => {
    // Load existing resumes from backend
    const load = async () => {
      try {
        setLoadingResumes(true);
        const res = await fetch(`${API_BASE}/resume`);
        if (!res.ok) throw new Error(`Failed to load resumes: ${res.status}`);
        const data = await res.json();
        const mapped = data.map((d) => ({
          id: d.id,
          name: d.original_name,
          type: d.content_type,
          size: d.size,
        }));
        setResumes(mapped);
        if (mapped.length > 0) setActiveResumeId(mapped[0].id);
      } catch (e) {
        console.error('Failed to load resumes', e);
      } finally {
        setLoadingResumes(false);
      }
    };
    load();
  }, []);

  const handleUpload = async (file, dataBuffer) => {
    // Upload to backend using multipart; no client-side size limit
    const form = new FormData();
    const blob = dataBuffer instanceof ArrayBuffer ? new Blob([dataBuffer], { type: file.type || 'application/octet-stream' }) : file;
    const namedFile = new File([blob], file.name, { type: file.type || 'application/octet-stream' });
    form.append('file', namedFile);
    try {
      const res = await fetch(`${API_BASE}/resume/upload`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const saved = await res.json();
      const item = { id: saved.id, name: saved.original_name, type: saved.content_type, size: saved.size };
      setResumes((prev) => [item, ...prev]);
      setActiveResumeId(item.id);
    } catch (e) {
      console.error('Upload error', e);
      alert('Upload failed. Please try again.');
    }
  };

  const handleDownload = async (resume) => {
    try {
      const res = await fetch(`${API_BASE}/resume/${resume.id}`);
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resume.name || 'resume';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download error', e);
      alert('Download failed.');
    }
  };

  // Return the planned array so callers can use it immediately
  const handlePlan = async () => {
    if (!activeResumeId || settings.boards.length === 0) return [];
    try {
      const body = {
        boards: settings.boards,
        resume_id: activeResumeId,
        min_score: settings.minScore,
        paraphrase_level: settings.paraphraseLevel,
        daily_cap: settings.dailyCap,
        time_window_start: Number(settings.windowStart.split(':')[0]),
        time_window_end: Number(settings.windowEnd.split(':')[0]),
      };
      const res = await fetch(`${API_BASE}/apply/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Planning failed: ${res.status}`);
      const data = await res.json();
      // Map to UI planned preview times using today with planned_time hour:minute
      const now = new Date();
      const plannedUi = data.map((d) => {
        const [h, m] = (d.planned_time || '09:00').split(':').map((x) => Number(x));
        const t = new Date(now);
        t.setHours(h, m, 0, 0);
        return { id: d.id, board: d.board, time: t.toISOString(), minScore: d.match_score ?? settings.minScore, paraphraseLevel: d.paraphrase_level ?? settings.paraphraseLevel };
      });
      const sorted = plannedUi.sort((a, b) => new Date(a.time) - new Date(b.time));
      setPlanned(sorted);
      return sorted;
    } catch (e) {
      console.error(e);
      alert('Planning failed.');
      return [];
    }
  };

  const handleApplyNow = async () => {
    if (!activeResumeId || settings.boards.length === 0) return;
    setSending(true);
    try {
      // Ensure there is a plan and use the result immediately
      const planToUse = planned.length > 0 ? planned : await handlePlan();
      const ids = (planToUse || []).map((p) => p.id).filter(Boolean);
      if (ids.length === 0) throw new Error('No planned applications to send');

      const res = await fetch(`${API_BASE}/apply/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_ids: ids }),
      });
      if (!res.ok) throw new Error(`Send failed: ${res.status}`);
      const data = await res.json();
      const nowIso = new Date().toISOString();
      setSent(data.map((d) => ({ board: d.board, time: nowIso })));
    } catch (e) {
      console.error(e);
      alert('Apply now failed.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="rounded-2xl p-6 bg-indigo-50/60 border border-indigo-100">
          <p className="text-gray-800 text-sm">
            Tip: You can upload large resumes here — there is no client-side size limit. Backend accepts large payloads subject to infrastructure limits.
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
          onSettingsChange={(s) => { setSettings(s); setPlanned([]); }}
          planned={planned}
          onPlan={handlePlan}
          sent={sent}
          sending={sending}
          onApplyNow={handleApplyNow}
        />

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold">How it works</h3>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 space-y-1">
            <li>Upload and select your preferred resume version.</li>
            <li>Paste a job description to see the top keywords instantly.</li>
            <li>Configure job boards and pacing, then review the planned schedule.</li>
            <li>Use Apply now to submit via the backend demo endpoints.</li>
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
