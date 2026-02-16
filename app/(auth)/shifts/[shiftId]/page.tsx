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
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Shift Detail</h1>
            <p className="text-[14px] text-gray-500 mt-1">Day Shift — Newman Operations</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            <span className="text-[12px] text-blue-400 font-medium">Open</span>
          </div>
        </div>

        <div className="flex gap-1 mb-6 border-b border-white/[0.06] pb-px">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-amber-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Handover' && <HandoverForm />}
        
        {activeTab === 'Actions' && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
            <p className="text-gray-600 text-[14px]">No actions for this shift</p>
            <button className="mt-3 bg-white/[0.04] text-amber-400 px-4 py-2 rounded-lg text-[13px] hover:bg-white/[0.06] transition-colors">
              Add Action
            </button>
          </div>
        )}
        
        {activeTab === 'Summary' && <ShiftSummary onGenerate={() => {}} />}
        
        {activeTab === 'Audit Trail' && <AuditTimeline entries={[]} />}

        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          <button className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-lg transition-colors text-[14px]">
            Sign Off Shift
          </button>
          <p className="text-[12px] text-gray-600 mt-2 text-center">Signing off locks this shift. Only corrections (append-only) allowed after sign-off.</p>
        </div>
      </div>
    </div>
  );
}
