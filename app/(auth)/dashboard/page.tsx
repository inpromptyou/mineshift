'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-[14px] text-gray-500 mt-1">Mining operations overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Shift', value: '\u2014', sub: 'None running' },
            { label: 'Open Actions', value: '0', sub: 'All clear' },
            { label: 'Overdue', value: '0', sub: 'None' },
            { label: 'Days Without Incident', value: '\u2014', sub: 'Not tracking yet' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
              <p className="text-[12px] text-gray-600 uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="text-2xl font-mono font-bold">{stat.value}</p>
              <p className="text-[12px] text-gray-600 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Current Shift */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
              <p className="text-gray-500 text-[14px] mb-4">No active shift</p>
              <Link href="/shifts/new" className="inline-flex items-center bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-2.5 rounded-lg transition-colors text-[14px]">
                Start New Shift
              </Link>
            </div>

            {/* Recent Shifts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-semibold">Recent Shifts</h2>
                <Link href="/shifts" className="text-[13px] text-amber-500 hover:text-amber-400">View all</Link>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
                <p className="text-[14px] text-gray-600">No shifts recorded yet</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <h2 className="text-[15px] font-semibold">Quick Actions</h2>
            <Link href="/shifts/new" className="block w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-center py-2.5 rounded-lg transition-colors text-[14px]">
              New Shift
            </Link>
            <Link href="/actions" className="block w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] text-gray-300 text-center py-2.5 rounded-lg transition-colors text-[14px]">
              View Actions
            </Link>
            <Link href="/search" className="block w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] text-gray-300 text-center py-2.5 rounded-lg transition-colors text-[14px]">
              Search History
            </Link>
            <Link href="/assets" className="block w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] text-gray-300 text-center py-2.5 rounded-lg transition-colors text-[14px]">
              Asset Registry
            </Link>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 mt-6">
              <h3 className="text-[13px] font-medium mb-3">System</h3>
              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Network</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span className="text-gray-400">Online</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sync</span>
                  <span className="text-gray-400">Up to date</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pending</span>
                  <span className="text-gray-400 font-mono">0 ops</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
