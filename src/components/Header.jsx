import { Rocket, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white grid place-items-center shadow-lg">
            <Rocket size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">AutoApply Pro</h1>
            <p className="text-xs text-gray-500 -mt-0.5">AI-assisted job application copilot</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition">
          <Settings size={16} />
          Settings
        </button>
      </div>
    </header>
  );
}
