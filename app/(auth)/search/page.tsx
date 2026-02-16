'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Search</h1>

        <div className="relative mb-6">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search shifts, actions, assets..."
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 text-[14px] focus:outline-none focus:border-amber-500/40"
          />
          <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {query ? (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
            <p className="text-gray-600 text-[14px]">No results for &quot;{query}&quot;</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500 text-[14px]">Search across all shift handovers, actions, and assets.</p>
            <div className="grid grid-cols-2 gap-3">
              {['Crusher 2', 'bearing temperature', 'night shift delays', 'safety incident'].map(example => (
                <button
                  key={example}
                  onClick={() => setQuery(example)}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 text-left text-[13px] text-gray-500 hover:border-amber-500/20 hover:text-white transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
