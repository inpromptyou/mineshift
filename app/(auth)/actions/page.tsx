'use client';

import Navbar from '@/components/Navbar';

export default function ActionsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Actions</h1>
            <p className="text-[14px] text-gray-500 mt-1">Track and manage shift actions</p>
          </div>
          <button className="bg-amber-500 hover:bg-amber-400 text-black font-medium px-4 py-2 rounded-lg text-[13px] transition-colors">
            New Action
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {['All', 'Open', 'In Progress', 'Overdue', 'Closed'].map(filter => (
            <button key={filter} className={`px-3 py-1.5 rounded-md text-[13px] ${filter === 'All' ? 'bg-white/[0.06] text-white' : 'text-gray-500 hover:text-white'}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
          <p className="text-gray-600 text-[14px]">No actions yet. Actions are created during shift handovers.</p>
        </div>
      </div>
    </div>
  );
}
