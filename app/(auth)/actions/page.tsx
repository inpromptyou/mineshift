'use client';

import Navbar from '@/components/Navbar';
import ActionCard from '@/components/ActionCard';

export default function ActionsPage() {
  return (
    <div className="min-h-screen bg-[#111114]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Actions</h1>
            <p className="text-gray-500 text-sm">Track and manage all shift actions</p>
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
            + New Action
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {['All', 'Open', 'In Progress', 'Overdue', 'Closed'].map(filter => (
            <button key={filter} className={`px-3 py-1.5 rounded-md text-sm ${filter === 'All' ? 'bg-amber-500/10 text-amber-400' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-8 text-center">
          <p className="text-gray-600 text-sm">No actions yet. Actions are created during shift handovers.</p>
        </div>
      </div>
    </div>
  );
}
