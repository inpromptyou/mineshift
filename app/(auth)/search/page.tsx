'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#111114]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Search</h1>

        <div className="relative mb-6">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search shifts, actions, assets... e.g. 'Crusher 2' or 'bearing temperature'"
            className="w-full bg-[#1a1a1f] border border-[#2a2a30] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/50"
          />
          <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {query ? (
          <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-8 text-center">
            <p className="text-gray-600 text-sm">No results for &quot;{query}&quot;</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">Search across all shift handovers, actions, and assets.</p>
            <div className="grid grid-cols-2 gap-3">
              {['Crusher 2', 'bearing temp', 'night shift delays', 'safety incident'].map(example => (
                <button
                  key={example}
                  onClick={() => setQuery(example)}
                  className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-3 text-left text-sm text-gray-400 hover:border-amber-500/30 hover:text-white transition-colors"
                >
                  &quot;{example}&quot;
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
