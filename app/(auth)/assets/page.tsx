'use client';

import Navbar from '@/components/Navbar';

export default function AssetsPage() {
  return (
    <div className="min-h-screen bg-[#111114]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Asset Registry</h1>
            <p className="text-gray-500 text-sm">Equipment and asset tracking</p>
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
            + Add Asset
          </button>
        </div>

        <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-8 text-center">
          <p className="text-gray-600 text-sm mb-2">No assets registered yet</p>
          <p className="text-gray-700 text-xs">Add excavators, trucks, crushers, and other equipment to track their status across shifts.</p>
        </div>
      </div>
    </div>
  );
}
