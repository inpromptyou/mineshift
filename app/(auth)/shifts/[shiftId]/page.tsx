'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HandoverForm from '@/components/HandoverForm';
import ShiftSummary from '@/components/ShiftSummary';
import AuditTimeline from '@/components/AuditTimeline';

const tabs = ['Handover', 'Actions', 'Summary', 'Audit Trail'];

export default function ShiftDetailPage() {
  const [activeTab, setActiveTab] = useState('Handover');

  return (
    <div className="min-h-screen bg-[#111114]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Shift Detail</h1>
            <p className="text-gray-500 text-sm">☀️ Day Shift — Newman Operations</p>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">OPEN</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-[#2a2a30] pb-px">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-gray-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Handover' && <HandoverForm />}
        
        {activeTab === 'Actions' && (
          <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-6 text-center">
            <p className="text-gray-600 text-sm">No actions for this shift yet</p>
            <button className="mt-3 bg-amber-500/10 text-amber-400 px-4 py-2 rounded-lg text-sm hover:bg-amber-500/20 transition-colors">
              + Add Action
            </button>
          </div>
        )}
        
        {activeTab === 'Summary' && <ShiftSummary onGenerate={() => {}} />}
        
        {activeTab === 'Audit Trail' && <AuditTimeline entries={[]} />}

        {/* Sign Off */}
        <div className="mt-8 pt-6 border-t border-[#2a2a30]">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors">
            Sign Off Shift
          </button>
          <p className="text-xs text-gray-600 mt-2 text-center">Signing off locks this shift. Only corrections (append-only) allowed after sign-off.</p>
        </div>
      </div>
    </div>
  );
}
