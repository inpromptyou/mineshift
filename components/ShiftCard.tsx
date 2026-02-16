'use client';

import Link from 'next/link';

interface ShiftCardProps {
  id: string;
  shiftType: string;
  status: string;
  date: string;
  site: string;
  area?: string;
  createdBy: string;
  incidents: number;
  tonnes: number;
  openActions: number;
}

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  IN_PROGRESS: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  CLOSED: 'bg-green-500/10 text-green-400 border-green-500/30',
};

const shiftTypeLabels: Record<string, string> = {
  DAY: '☀️ Day Shift',
  NIGHT: '🌙 Night Shift',
  SWING: '🔄 Swing Shift',
};

export default function ShiftCard({ id, shiftType, status, date, site, area, createdBy, incidents, tonnes, openActions }: ShiftCardProps) {
  return (
    <Link href={`/shifts/${id}`} className="block">
      <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-4 hover:border-amber-500/30 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-white font-medium">{shiftTypeLabels[shiftType] || shiftType}</h3>
            <p className="text-sm text-gray-500">{date} — {site}{area ? ` / ${area}` : ''}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[status] || 'text-gray-400'}`}>
            {status}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-[#111114] rounded-lg p-2">
            <p className={`text-lg font-mono font-bold ${incidents > 0 ? 'text-red-400' : 'text-green-400'}`}>{incidents}</p>
            <p className="text-xs text-gray-500">Incidents</p>
          </div>
          <div className="bg-[#111114] rounded-lg p-2">
            <p className="text-lg font-mono font-bold text-white">{tonnes.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Tonnes</p>
          </div>
          <div className="bg-[#111114] rounded-lg p-2">
            <p className={`text-lg font-mono font-bold ${openActions > 0 ? 'text-amber-400' : 'text-green-400'}`}>{openActions}</p>
            <p className="text-xs text-gray-500">Open Actions</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">By {createdBy}</p>
      </div>
    </Link>
  );
}
