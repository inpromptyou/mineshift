'use client';

import Navbar from '@/components/Navbar';

export default function AssetsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Asset Registry</h1>
            <p className="text-[14px] text-gray-500 mt-1">Equipment and asset tracking</p>
          </div>
          <button className="bg-amber-500 hover:bg-amber-400 text-black font-medium px-4 py-2 rounded-lg text-[13px] transition-colors">
            Add Asset
          </button>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
          <p className="text-gray-600 text-[14px] mb-2">No assets registered</p>
          <p className="text-gray-700 text-[13px]">Add excavators, trucks, crushers, and other equipment to track status across shifts.</p>
        </div>
      </div>
    </div>
  );
}
