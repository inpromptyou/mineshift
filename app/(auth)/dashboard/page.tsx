'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#111114]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-500">Mining operations overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Shift', value: '—', color: 'text-amber-400' },
            { label: 'Open Actions', value: '0', color: 'text-blue-400' },
            { label: 'Overdue', value: '0', color: 'text-red-400' },
            { label: 'Days Without Incident', value: '—', color: 'text-green-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Shift */}
            <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-4">No active shift</p>
              <Link href="/shifts/new" className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors">
                + Start New Shift
              </Link>
            </div>

            {/* Recent Shifts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">Recent Shifts</h2>
                <Link href="/shifts" className="text-amber-500 text-sm hover:text-amber-400">View All →</Link>
              </div>
              <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm">No shifts recorded yet. Create your first shift handover.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
            <Link href="/shifts/new" className="block w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold text-center py-3 rounded-lg transition-colors">
              New Shift
            </Link>
            <Link href="/actions" className="block w-full bg-[#1a1a1f] hover:bg-[#222228] border border-[#2a2a30] text-white text-center py-3 rounded-lg transition-colors">
              View Actions
            </Link>
            <Link href="/search" className="block w-full bg-[#1a1a1f] hover:bg-[#222228] border border-[#2a2a30] text-white text-center py-3 rounded-lg transition-colors">
              Search History
            </Link>
            <Link href="/assets" className="block w-full bg-[#1a1a1f] hover:bg-[#222228] border border-[#2a2a30] text-white text-center py-3 rounded-lg transition-colors">
              Asset Registry
            </Link>

            {/* System Status */}
            <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-4 mt-6">
              <h3 className="text-sm font-medium text-white mb-3">System Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Network</span><span className="text-green-400">Online</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Sync</span><span className="text-green-400">Up to date</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Pending Ops</span><span className="text-gray-400 font-mono">0</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
