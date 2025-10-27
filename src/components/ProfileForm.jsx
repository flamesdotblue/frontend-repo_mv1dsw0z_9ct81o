import { useState } from 'react';
import { User, Mail, Briefcase } from 'lucide-react';

export default function ProfileForm({ onChange }) {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    headline: '',
    summary: '',
    skills: '',
    experience: '',
  });

  function update(field, value) {
    const next = { ...profile, [field]: value };
    setProfile(next);
    onChange?.(next);
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 grid place-items-center">
          <User size={18} />
        </div>
        <h2 className="text-lg font-semibold">Your Profile</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            className="mt-1 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Alex Johnson"
            value={profile.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="relative mt-1">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              className="w-full rounded-lg border-gray-300 pl-9 focus:border-blue-500 focus:ring-blue-500"
              placeholder="alex@email.com"
              value={profile.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Headline</label>
          <input
            className="mt-1 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Senior Frontend Engineer • React • TypeScript • UI Systems"
            value={profile.headline}
            onChange={(e) => update('headline', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="2-3 sentences highlighting your impact, tech stack, and unique strengths."
            value={profile.summary}
            onChange={(e) => update('summary', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Core Skills (comma separated)</label>
          <input
            className="mt-1 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="React, TypeScript, Node.js, AWS"
            value={profile.skills}
            onChange={(e) => update('skills', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Briefcase size={16} className="text-gray-400" /> Key Experience (high level)
          </label>
          <input
            className="mt-1 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Led frontend for X; Built Y; Scaled Z"
            value={profile.experience}
            onChange={(e) => update('experience', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
