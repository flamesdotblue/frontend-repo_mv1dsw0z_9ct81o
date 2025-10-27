import React from 'react';
import { Rocket, FileText, Send, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">AutoApply Pro</h1>
            <p className="text-xs text-gray-500">Upload resumes, analyze JDs, plan human-like applications</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a className="hover:text-gray-900 flex items-center gap-2" href="#resumes"><FileText className="w-4 h-4"/>Resumes</a>
          <a className="hover:text-gray-900 flex items-center gap-2" href="#analyzer"><Sparkles className="w-4 h-4"/>JD Analyzer</a>
          <a className="hover:text-gray-900 flex items-center gap-2" href="#planner"><Send className="w-4 h-4"/>Planner</a>
        </nav>
      </div>
    </header>
  );
}
