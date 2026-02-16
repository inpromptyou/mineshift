'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ShiftsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Shifts</h1>
            <p className="text-[14px] text-gray-500 mt-1">All shift handover records</p>
          </div>
          <Link href="/shifts/new" className="bg-amber-500 hover:bg-amber-400 text-black font-medium px-4 py-2 rounded-lg text-[13px] transition-colors">
            New Shift
          </Link>
        </div>

        <div className="flex gap-2 mb-6">
          {['All', 'Open', 'In Progress', 'Closed'].map(filter => (
            <button key={filter} className={`px-3 py-1.5 rounded-md text-[13px] ${filter === 'All' ? 'bg-white/[0.06] text-white' : 'text-gray-500 hover:text-white'}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
          <p className="text-gray-600 text-[14px] mb-4">No shifts recorded yet</p>
          <Link href="/shifts/new" className="text-amber-500 hover:text-amber-400 text-[13px]">Create your first shift</Link>
        </div>
      </div>
    </div>
  );
}
