'use client';

interface Citation {
  id: string;
  section: string;
  field: string;
  value: string;
}

interface ShiftSummaryProps {
  summary?: {
    handoverBrief: string;
    topRisks: string[];
    watchList: string[];
    citations: Citation[];
  };
  loading?: boolean;
  onGenerate?: () => void;
}

export default function ShiftSummary({ summary, loading, onGenerate }: ShiftSummaryProps) {
  if (!summary && !loading) {
    return (
      <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-6 text-center">
        <p className="text-gray-500 text-sm mb-3">AI summary not yet generated</p>
        <button
          onClick={onGenerate}
          className="bg-amber-500/10 text-amber-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-500/20 transition-colors"
        >
          Generate Summary
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Generating shift summary...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1f] border border-amber-500/20 rounded-lg p-5 space-y-4">
      <div className="flex items-center gap-2 text-amber-500 text-sm font-medium">
        <span>✨</span> AI Shift Summary
      </div>
      <p className="text-gray-200 text-sm leading-relaxed">{summary!.handoverBrief}</p>

      {summary!.topRisks.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Top Risks</h4>
          <ul className="space-y-1">
            {summary!.topRisks.map((risk, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span> {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary!.watchList.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Watch List</h4>
          <ul className="space-y-1">
            {summary!.watchList.map((item, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span> {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary!.citations.length > 0 && (
        <div className="pt-2 border-t border-[#2a2a30]">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Sources</p>
          <div className="flex flex-wrap gap-1">
            {summary!.citations.map(c => (
              <span key={c.id} className="text-[10px] bg-[#111114] text-gray-500 px-1.5 py-0.5 rounded font-mono">
                {c.section}.{c.field}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
