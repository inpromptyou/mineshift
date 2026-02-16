'use client';

interface AuditEntry {
  opId: string;
  actor: string;
  kind: string;
  path?: string;
  value?: string;
  ts: number;
  hash: string;
}

interface AuditTimelineProps {
  entries: AuditEntry[];
}

const kindLabels: Record<string, { label: string; color: string }> = {
  create: { label: 'Created', color: 'text-green-400' },
  update: { label: 'Updated', color: 'text-blue-400' },
  append: { label: 'Added', color: 'text-amber-400' },
  transition: { label: 'Status Changed', color: 'text-purple-400' },
  signoff: { label: 'Signed Off', color: 'text-amber-500' },
};

export default function AuditTimeline({ entries }: AuditTimelineProps) {
  return (
    <div className="space-y-0">
      {entries.map((entry, i) => {
        const { label, color } = kindLabels[entry.kind] || { label: entry.kind, color: 'text-gray-400' };
        return (
          <div key={entry.opId} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${color.replace('text-', 'bg-')}`} />
              {i < entries.length - 1 && <div className="w-px flex-1 bg-[#2a2a30]" />}
            </div>
            <div className="pb-4 flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className={`text-sm font-medium ${color}`}>{label}</span>
                {entry.path && <span className="text-xs text-gray-500 font-mono">{entry.path}</span>}
              </div>
              {entry.value && (
                <p className="text-sm text-gray-300 mt-0.5 truncate">{entry.value}</p>
              )}
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                <span>{entry.actor}</span>
                <span>{new Date(entry.ts).toLocaleString()}</span>
                <span className="font-mono text-[10px]" title={`Hash: ${entry.hash}`}>#{entry.hash.slice(0, 8)}</span>
              </div>
            </div>
          </div>
        );
      })}
      {entries.length === 0 && (
        <p className="text-gray-600 text-sm text-center py-8">No audit entries yet</p>
      )}
    </div>
  );
}
