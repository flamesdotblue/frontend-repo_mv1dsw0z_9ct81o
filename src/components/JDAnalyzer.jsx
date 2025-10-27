import React from 'react';
import { Sparkles } from 'lucide-react';

export default function JDAnalyzer({ jdText, onChange, keywords }) {
  return (
    <section id="analyzer" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Job Description Analyzer</h2>
          <p className="text-sm text-gray-500 mt-1">Paste a job description to extract the most relevant keywords.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 text-sm">
          <Sparkles className="w-4 h-4" /> Live extraction
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <textarea
          value={jdText}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste job description here..."
          className="w-full min-h-[220px] p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">Top Keywords</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {keywords.length === 0 ? (
              <p className="text-sm text-gray-500">Keywords will appear here as you type.</p>
            ) : (
              keywords.map((k) => (
                <span key={k.word} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-800 text-sm">
                  {k.word}
                  <span className="text-xs text-gray-500">×{k.count}</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
