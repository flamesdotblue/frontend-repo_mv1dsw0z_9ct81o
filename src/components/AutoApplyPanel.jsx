import React, { useMemo } from 'react';
import { Send, Timer, ListChecks, AlertTriangle, CheckCircle2 } from 'lucide-react';

const jobBoards = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'naukri', label: 'Naukri' },
  { key: 'glassdoor', label: 'Glassdoor' },
  { key: 'foundit', label: 'Foundit' },
];

export default function AutoApplyPanel({
  activeResumeId,
  settings,
  onSettingsChange,
  planned,
  onPlan,
  sent = [],
  sending = false,
  onApplyNow,
}) {
  const resumeMissing = !activeResumeId;

  const disabled = useMemo(
    () => resumeMissing || settings.boards.length === 0,
    [resumeMissing, settings.boards.length]
  );

  return (
    <section id="planner" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">Auto-Apply Planner</h2>
          <p className="text-sm text-gray-500 mt-1">Set your preferences and plan a human-like send schedule.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-50 text-orange-700 text-sm">
          <Timer className="w-4 h-4"/> Humanized pacing
        </div>
      </div>

      {resumeMissing && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
          <AlertTriangle className="w-4 h-4"/> Select an active resume to enable planning.
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Job Boards</p>
            <div className="flex flex-wrap gap-2">
              {jobBoards.map((b) => {
                const selected = settings.boards.includes(b.key);
                return (
                  <button
                    key={b.key}
                    onClick={() => {
                      const next = selected
                        ? settings.boards.filter((x) => x !== b.key)
                        : [...settings.boards, b.key];
                      onSettingsChange({ ...settings, boards: next });
                    }}
                    className={`px-3 py-1.5 rounded-md border text-sm ${selected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Min match score: {settings.minScore}%</label>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.minScore}
                onChange={(e) => onSettingsChange({ ...settings, minScore: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Paraphrase level: {settings.paraphraseLevel}</label>
              <input
                type="range"
                min={0}
                max={3}
                value={settings.paraphraseLevel}
                onChange={(e) => onSettingsChange({ ...settings, paraphraseLevel: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Daily cap</label>
              <input
                type="number"
                min={1}
                value={settings.dailyCap}
                onChange={(e) => onSettingsChange({ ...settings, dailyCap: Number(e.target.value) })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Time window (local)</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="time"
                  value={settings.windowStart}
                  onChange={(e) => onSettingsChange({ ...settings, windowStart: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={settings.windowEnd}
                  onChange={(e) => onSettingsChange({ ...settings, windowEnd: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-2">Plan Preview</p>
            {planned.length === 0 ? (
              <p className="text-sm text-gray-500">No plan yet. Configure settings and click Plan.</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-auto pr-2">
                {planned.map((p, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm bg-white rounded-md border border-gray-200 px-3 py-2">
                    <span className="font-medium capitalize">{p.board}</span>
                    <span className="text-gray-600">{new Date(p.time).toLocaleString()}</span>
                    <span className="text-gray-500">score ≥ {p.minScore}%</span>
                    <span className="text-gray-500">paraphrase {p.paraphraseLevel}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              disabled={disabled}
              onClick={onPlan}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              <Send className="w-4 h-4"/> Plan
            </button>
            <button
              disabled={disabled || sending}
              onClick={onApplyNow}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${disabled || sending ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              <Send className="w-4 h-4"/> {sending ? 'Applying…' : 'Apply now'}
            </button>
          </div>

          {sent.length > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-800 mb-2 inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4"/> Sent applications
              </p>
              <ul className="text-sm text-emerald-900 space-y-1">
                {sent.map((s, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="capitalize">{s.board}</span>
                    <span className="text-emerald-700">{new Date(s.time).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs text-gray-500 flex items-start gap-2">
            <ListChecks className="w-4 h-4 mt-0.5"/>
            Connected to backend demo for planning and sending. Records are saved for this session.
          </div>
        </div>
      </div>
    </section>
  );
}
