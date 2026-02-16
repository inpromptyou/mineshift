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
    console.log('Shift data:', { meta: shiftMeta, sections: data });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          {step === 'setup' ? 'New Shift' : 'Shift Handover'}
        </h1>

        {step === 'setup' ? (
          <form onSubmit={handleSetupSubmit} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-[13px] text-gray-500 mb-1.5">Site</label>
              <input
                type="text"
                value={shiftMeta.site}
                onChange={e => setShiftMeta(p => ({ ...p, site: e.target.value }))}
                placeholder="e.g. Newman Operations"
                required
                className="w-full bg-[#0A0A0C] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-700 text-[14px] focus:outline-none focus:border-amber-500/40"
              />
            </div>
            <div>
              <label className="block text-[13px] text-gray-500 mb-1.5">Area</label>
              <input
                type="text"
                value={shiftMeta.area}
                onChange={e => setShiftMeta(p => ({ ...p, area: e.target.value }))}
                placeholder="e.g. Processing Plant / Pit 3"
                className="w-full bg-[#0A0A0C] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-700 text-[14px] focus:outline-none focus:border-amber-500/40"
              />
            </div>
            <div>
              <label className="block text-[13px] text-gray-500 mb-1.5">Crew</label>
              <input
                type="text"
                value={shiftMeta.crew}
                onChange={e => setShiftMeta(p => ({ ...p, crew: e.target.value }))}
                placeholder="e.g. Crew Alpha"
                className="w-full bg-[#0A0A0C] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-gray-700 text-[14px] focus:outline-none focus:border-amber-500/40"
              />
            </div>
            <div>
              <label className="block text-[13px] text-gray-500 mb-1.5">Shift Type</label>
              <div className="grid grid-cols-3 gap-3">
                {(['DAY', 'NIGHT', 'SWING'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setShiftMeta(p => ({ ...p, shiftType: type }))}
                    className={`py-3 rounded-lg text-[13px] font-medium transition-colors ${
                      shiftMeta.shiftType === type
                        ? 'bg-amber-500 text-black'
                        : 'bg-[#0A0A0C] border border-white/[0.08] text-gray-400 hover:text-white'
                    }`}
                  >
                    {type === 'DAY' ? 'Day' : type === 'NIGHT' ? 'Night' : 'Swing'}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 rounded-lg transition-colors text-[14px]">
              Continue to Handover
            </button>
          </form>
        ) : (
          <div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 mb-4 flex items-center justify-between text-[13px]">
              <span className="text-gray-500">{shiftMeta.site} / {shiftMeta.area || 'All Areas'} / {shiftMeta.crew || 'No Crew'}</span>
              <span className="text-amber-400 font-medium">{shiftMeta.shiftType}</span>
            </div>
            <HandoverForm onSubmit={handleHandoverSubmit} />
          </div>
        )}
      </div>
    </div>
  );
}
