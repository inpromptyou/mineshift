'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ShiftsPage() {
  return (
    <div className="min-h-screen bg-[#111114]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Shifts</h1>
            <p className="text-gray-500 text-sm">All shift handover records</p>
          </div>
          <Link href="/shifts/new" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
            + New Shift
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['All', 'Open', 'In Progress', 'Closed'].map(filter => (
            <button key={filter} className={`px-3 py-1.5 rounded-md text-sm ${filter === 'All' ? 'bg-amber-500/10 text-amber-400' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No shifts recorded yet</p>
          <Link href="/shifts/new" className="text-amber-500 hover:text-amber-400 text-sm">Create your first shift →</Link>
        </div>
      </div>
    </div>
  );
}
