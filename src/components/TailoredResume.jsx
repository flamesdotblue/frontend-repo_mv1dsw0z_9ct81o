import { useMemo } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

function scoreMatch(skillsList, keywords) {
  const skills = skillsList.map((s) => s.trim().toLowerCase()).filter(Boolean);
  const keySet = new Set(keywords.map((k) => k.toLowerCase()));
  const overlap = skills.filter((s) => keySet.has(s));
  const pct = skills.length ? Math.round((overlap.length / skills.length) * 100) : 0;
  return { overlap, pct };
}

export default function TailoredResume({ profile, jdKeywords }) {
  const skillsArr = (profile.skills || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const { overlap, pct } = useMemo(
    () => scoreMatch(skillsArr, jdKeywords.map((k) => k.term)),
    [skillsArr, jdKeywords]
  );

  const resumeText = useMemo(() => {
    const lines = [];
    const nameLine = profile.name ? `${profile.name} — ${profile.headline || ''}`.trim() : '';
    if (nameLine) lines.push(nameLine);
    if (profile.email) lines.push(profile.email);
    if (profile.summary) lines.push('', 'Summary', profile.summary);

    if (skillsArr.length) {
      const prioritized = [
        ...overlap,
        ...skillsArr.filter((s) => !overlap.includes(s)),
      ];
      lines.push('', 'Key Skills', prioritized.join(', '));
    }

    if (profile.experience) {
      lines.push('', 'Highlights', profile.experience);
    }

    if (overlap.length) {
      lines.push('', 'Role Alignment', `This profile aligns with: ${overlap.join(', ')}`);
    }

    return lines.join('\n');
  }, [profile, skillsArr, overlap]);

  const downloadResume = () => {
    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(profile.name || 'resume').replace(/\s+/g, '_')}_tailored.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 grid place-items-center">
            <CheckCircle2 size={18} />
          </div>
          <h2 className="text-lg font-semibold">Tailored Resume Preview</h2>
        </div>
        <button
          onClick={downloadResume}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow"
        >
          <Download size={16} /> Download
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        <p className="text-sm text-gray-600">
          Match score based on skills overlap: <span className="font-medium text-gray-900">{pct}%</span>
        </p>
      </div>

      <div className="mt-4">
        <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm leading-relaxed overflow-auto whitespace-pre-wrap">
{resumeText}
        </pre>
      </div>

      {overlap.length === 0 && (
        <p className="mt-3 text-xs text-gray-500">Tip: Add relevant skills to improve alignment and increase callbacks.</p>
      )}
    </section>
  );
}
