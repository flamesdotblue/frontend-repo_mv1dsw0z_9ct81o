import React, { useRef } from 'react';
import { Upload, CheckCircle2, Download, File, Info, Star } from 'lucide-react';

export default function ResumeUpload({ resumes, onUpload, onSelect, activeResumeId, onDownload }) {
  const inputRef = useRef(null);

  return (
    <section id="resumes" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">Your Resumes</h2>
          <p className="text-sm text-gray-500 mt-1">Upload and manage multiple versions. No client-side file size limit.</p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Upload className="w-4 h-4" /> Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            // Intentionally no size check to keep uploads unlimited on the client side
            const reader = new FileReader();
            reader.onload = () => {
              const dataUrl = reader.result;
              onUpload?.(file, dataUrl);
            };
            reader.readAsArrayBuffer(file);
            // Reset input so same file can be selected again
            e.target.value = '';
          }}
        />
      </div>

      <div className="mt-6">
        {resumes.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-dashed border-gray-300 text-gray-600">
            <Info className="w-4 h-4" />
            <p className="text-sm">No resumes yet. Click Upload to add your first file.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {resumes.map((r) => (
              <li
                key={r.id}
                className={`flex items-center justify-between p-4 rounded-xl border ${activeResumeId === r.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activeResumeId === r.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                    <File className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {r.name}
                      {activeResumeId === r.id && (
                        <span className="inline-flex items-center gap-1 text-xs text-indigo-700">
                          <Star className="w-3 h-3 fill-indigo-600 text-indigo-600"/> Active
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{r.type} • {formatBytes(r.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1.5 text-sm rounded-md border ${activeResumeId === r.id ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => onSelect?.(r.id)}
                  >
                    {activeResumeId === r.id ? (
                      <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Selected</span>
                    ) : (
                      'Select'
                    )}
                  </button>
                  <button
                    className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
                    onClick={() => onDownload?.(r)}
                  >
                    <Download className="w-4 h-4"/> Download
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
