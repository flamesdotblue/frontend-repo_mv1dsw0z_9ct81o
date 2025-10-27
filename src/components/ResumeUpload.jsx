import { useEffect, useState } from 'react';
import { Upload, FileText, CheckCircle2, Loader2, Trash2 } from 'lucide-react';

export default function ResumeUpload({ onSelect }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [active, setActive] = useState(null);

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  async function loadResumes() {
    try {
      const res = await fetch(`${backend}/resume`);
      const data = await res.json();
      setResumes(data);
      if (data.length && !active) {
        setActive(data[0].id);
        onSelect?.(data[0].id);
      }
    } catch (e) {
      console.error('Failed to load resumes', e);
    }
  }

  useEffect(() => {
    loadResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${backend}/resume/upload`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Upload failed');
      await loadResumes();
      setFile(null);
    } catch (err) {
      console.error(err);
      alert('Upload failed. Try a smaller file (max ~5MB).');
    } finally {
      setUploading(false);
    }
  }

  function selectResume(id) {
    setActive(id);
    onSelect?.(id);
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-rose-50 text-rose-600 grid place-items-center">
            <FileText size={18} />
          </div>
          <h2 className="text-lg font-semibold">Resume</h2>
        </div>
        {active && (
          <a
            href={`${backend}/resume/${active}`}
            className="text-sm text-rose-700 hover:text-rose-800"
          >
            Download active
          </a>
        )}
      </div>

      <form onSubmit={handleUpload} className="rounded-xl border border-dashed border-gray-300 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload resume (PDF, DOCX)</label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="flex-1 text-sm"
          />
          <button
            type="submit"
            disabled={!file || uploading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} Upload
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">Stored securely in your workspace and attached when sending applications.</p>
      </form>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Your uploads</p>
        {resumes.length === 0 && (
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-600">No resumes uploaded yet.</div>
        )}
        <div className="space-y-2">
          {resumes.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => selectResume(r.id)}
              className={`w-full text-left p-3 rounded-lg border ${active === r.id ? 'border-rose-300 bg-rose-50' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className={active === r.id ? 'text-rose-600' : 'text-gray-400'} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.original_name}</p>
                    <p className="text-xs text-gray-500">{(r.size / 1024).toFixed(1)} KB • {r.content_type}</p>
                  </div>
                </div>
                <a
                  href={`${backend}/resume/${r.id}`}
                  className="text-xs text-gray-600 hover:text-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  Download
                </a>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
