import { useMemo } from 'react';
import { FileText, Wand2 } from 'lucide-react';

const STOPWORDS = new Set([
  'the','and','to','of','a','in','for','with','on','is','are','as','be','or','by','an','from','at','this','that','we','you','our','your','will','their','they','it','have','has','within','using','experience','years','skills','required','preferred','ability','work','team','strong','plus','including','across'
]);

function extractKeywords(text) {
  const words = (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+.# ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w) && w.length > 2);
  const counts = words.reduce((acc, w) => {
    acc[w] = (acc[w] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([term, count]) => ({ term, count }));
}

export default function JDAnalyzer({ jdText, onChange }) {
  const keywords = useMemo(() => extractKeywords(jdText), [jdText]);

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-600 grid place-items-center">
            <FileText size={18} />
          </div>
          <h2 className="text-lg font-semibold">Job Description</h2>
        </div>
        <span className="text-xs text-gray-500">Keyword signals update live</span>
      </div>

      <textarea
        rows={8}
        className="w-full rounded-xl border-gray-300 focus:border-violet-500 focus:ring-violet-500"
        placeholder="Paste the job description here to analyze requirements, extract keywords, and tailor your resume."
        value={jdText}
        onChange={(e) => onChange?.(e.target.value)}
      />

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Wand2 size={16} className="text-violet-600" />
          <p className="text-sm text-gray-600">Top extracted keywords</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywords.length === 0 && (
            <span className="text-sm text-gray-400">No keywords yet — paste a job description.</span>
          )}
          {keywords.map((k) => (
            <span
              key={k.term}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-violet-50 text-violet-700 border border-violet-100"
            >
              {k.term}
              <span className="text-[10px] text-violet-500">×{k.count}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
