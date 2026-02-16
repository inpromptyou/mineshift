'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import HandoverForm from '@/components/HandoverForm';

export default function NewShiftPage() {
  const router = useRouter();
  const [step, setStep] = useState<'setup' | 'handover'>('setup');
  const [shiftMeta, setShiftMeta] = useState({
    site: '',
    area: '',
    crew: '',
    shiftType: 'DAY' as 'DAY' | 'NIGHT' | 'SWING',
  });

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('handover');
  };

  const handleHandoverSubmit = (data: Record<string, Record<string, string>>) => {
    // TODO: Create shift via sync engine op-log
    console.log('Shift data:', { meta: shiftMeta, sections: data });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#111114]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">
          {step === 'setup' ? 'New Shift' : 'Shift Handover'}
        </h1>

        {step === 'setup' ? (
          <form onSubmit={handleSetupSubmit} className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-6 space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Site</label>
              <input
                type="text"
                value={shiftMeta.site}
                onChange={e => setShiftMeta(p => ({ ...p, site: e.target.value }))}
                placeholder="e.g. Newman Operations"
                required
                className="w-full bg-[#111114] border border-[#2a2a30] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Area</label>
              <input
                type="text"
                value={shiftMeta.area}
                onChange={e => setShiftMeta(p => ({ ...p, area: e.target.value }))}
                placeholder="e.g. Processing Plant / Pit 3"
                className="w-full bg-[#111114] border border-[#2a2a30] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Crew</label>
              <input
                type="text"
                value={shiftMeta.crew}
                onChange={e => setShiftMeta(p => ({ ...p, crew: e.target.value }))}
                placeholder="e.g. Crew Alpha"
                className="w-full bg-[#111114] border border-[#2a2a30] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Shift Type</label>
              <div className="grid grid-cols-3 gap-3">
                {(['DAY', 'NIGHT', 'SWING'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setShiftMeta(p => ({ ...p, shiftType: type }))}
                    className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                      shiftMeta.shiftType === type
                        ? 'bg-amber-500 text-black'
                        : 'bg-[#111114] border border-[#2a2a30] text-gray-400 hover:text-white'
                    }`}
                  >
                    {type === 'DAY' ? '☀️ Day' : type === 'NIGHT' ? '🌙 Night' : '🔄 Swing'}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg transition-colors">
              Continue to Handover →
            </button>
          </form>
        ) : (
          <div>
            <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-3 mb-4 flex items-center justify-between text-sm">
              <span className="text-gray-400">{shiftMeta.site} / {shiftMeta.area || 'All Areas'} / {shiftMeta.crew || 'No Crew'}</span>
              <span className="text-amber-400">{shiftMeta.shiftType === 'DAY' ? '☀️ Day' : shiftMeta.shiftType === 'NIGHT' ? '🌙 Night' : '🔄 Swing'}</span>
            </div>
            <HandoverForm onSubmit={handleHandoverSubmit} />
          </div>
        )}
      </div>
    </div>
  );
}
