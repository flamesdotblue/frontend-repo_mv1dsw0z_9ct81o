import { useMemo, useState } from 'react';
import { Play, Pause, ShieldCheck, Globe, Linkedin, Search, CheckCircle2 } from 'lucide-react';

// Simple icon shim for boards where we don't have dedicated icons
function BoardIcon({ name }) {
  const base = 'h-4 w-4';
  switch (name) {
    case 'LinkedIn':
      return <Linkedin className={base} />;
    default:
      return <Globe className={base} />;
  }
}

const ALL_BOARDS = ['LinkedIn', 'Naukri', 'Glassdoor', 'Foundit'];

function generateMockJobs(profile, keywords) {
  const title = profile.headline || 'Software Engineer';
  const city = 'Remote';
  const ks = keywords.slice(0, 3).map((k) => k.term.toUpperCase());
  return [1, 2, 3, 4, 5].map((i) => ({
    id: i,
    title: `${title} (${ks[i % ks.length] || 'GENERAL'})`,
    company: ['Acme', 'Globex', 'Innotech', 'Umbrella', 'Stark'][i % 5],
    location: city,
    source: ALL_BOARDS[i % ALL_BOARDS.length],
    score: 60 + (i * 7) % 35,
  }));
}

export default function AutoApplyPanel({ profile, jdKeywords }) {
  const [selectedBoards, setSelectedBoards] = useState(new Set(['LinkedIn', 'Glassdoor']));
  const [safeMode, setSafeMode] = useState(true);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [minScore, setMinScore] = useState(70);

  const mockJobs = useMemo(() => generateMockJobs(profile, jdKeywords), [profile, jdKeywords]);

  const filtered = useMemo(() => {
    return mockJobs.filter((j) => selectedBoards.has(j.source) && j.score >= minScore);
  }, [mockJobs, selectedBoards, minScore]);

  function toggleBoard(name) {
    const next = new Set(selectedBoards);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelectedBoards(next);
  }

  function startScan() {
    setRunning(true);
    // Simulate async scanning and applying
    setTimeout(() => {
      const applied = filtered.map((j) => ({ ...j, applied: true, safeMode }));
      setResults(applied);
      setRunning(false);
    }, 700);
  }

  function stopScan() {
    setRunning(false);
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-cyan-50 text-cyan-600 grid place-items-center">
            <Search size={18} />
          </div>
          <h2 className="text-lg font-semibold">Auto-Apply Planner</h2>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={safeMode}
              onChange={(e) => setSafeMode(e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="inline-flex items-center gap-1 text-gray-700">
              <ShieldCheck size={14} className="text-emerald-600" /> Safe mode
            </span>
          </label>
          {running ? (
            <button onClick={stopScan} className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-black">
              <Pause size={16} /> Stop
            </button>
          ) : (
            <button onClick={startScan} className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-cyan-600 text-white hover:bg-cyan-700">
              <Play size={16} /> Start
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <p className="text-sm font-medium text-gray-700 mb-2">Sources</p>
          <div className="space-y-2">
            {ALL_BOARDS.map((b) => (
              <label key={b} className="flex items-center justify-between gap-3 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <span className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <BoardIcon name={b} /> {b}
                </span>
                <input
                  type="checkbox"
                  checked={selectedBoards.has(b)}
                  onChange={() => toggleBoard(b)}
                  className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
              </label>
            ))}
          </div>

          <div className="mt-4">
            <label className="flex items-center justify-between text-sm text-gray-700">
              <span>Minimum match score</span>
              <span className="font-medium text-gray-900">{minScore}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="mt-2 w-full"
            />
          </div>

          <p className="mt-3 text-xs text-gray-500">Safe mode randomizes delays, rotates phrasing, and keeps apply volume human-like to avoid detection.</p>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Matches</p>
            <span className="text-xs text-gray-500">{filtered.length} found</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {filtered.map((job) => (
              <div key={job.id} className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.company} • {job.location} • {job.source}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <CheckCircle2 size={14} /> {job.score}% match
                  </span>
                </div>
                <div className="mt-3 text-xs text-gray-500">Action: {running ? 'Scanning…' : 'Would auto-apply with tailored resume'}</div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="p-6 rounded-xl border border-dashed border-gray-300 text-center text-sm text-gray-500">
                No matches above threshold yet. Adjust filters or update your profile/JD.
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-2 p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600">
                Applied to {results.length} jobs in simulation. Connect accounts to enable real submissions.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
