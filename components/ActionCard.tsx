'use client';

interface ActionCardProps {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  assignedTo: string;
  dueTime?: string;
  category?: string;
  onStatusChange?: (id: string, newStatus: string) => void;
}

const priorityColors: Record<string, string> = {
  LOW: 'text-gray-400',
  MEDIUM: 'text-blue-400',
  HIGH: 'text-amber-400',
  CRITICAL: 'text-red-400',
};

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-500/10 text-blue-400',
  IN_PROGRESS: 'bg-amber-500/10 text-amber-400',
  CLOSED: 'bg-green-500/10 text-green-400',
  CANCELLED: 'bg-gray-500/10 text-gray-400',
};

export default function ActionCard({ id, title, description, priority, status, assignedTo, dueTime, category, onStatusChange }: ActionCardProps) {
  return (
    <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase ${priorityColors[priority]}`}>{priority}</span>
          {category && <span className="text-xs text-gray-600 bg-[#111114] px-2 py-0.5 rounded">{category}</span>}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>{status}</span>
      </div>
      <h4 className="text-white font-medium mb-1">{title}</h4>
      {description && <p className="text-sm text-gray-400 mb-3">{description}</p>}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Assigned: <span className="text-gray-300">{assignedTo}</span></span>
        {dueTime && <span>Due: <span className="text-amber-400">{dueTime}</span></span>}
      </div>
      {status !== 'CLOSED' && status !== 'CANCELLED' && onStatusChange && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-[#2a2a30]">
          {status === 'OPEN' && (
            <button onClick={() => onStatusChange(id, 'IN_PROGRESS')} className="text-xs bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-md hover:bg-amber-500/20 transition-colors">
              Start
            </button>
          )}
          <button onClick={() => onStatusChange(id, 'CLOSED')} className="text-xs bg-green-500/10 text-green-400 px-3 py-1.5 rounded-md hover:bg-green-500/20 transition-colors">
            Close
          </button>
          <button onClick={() => onStatusChange(id, 'CANCELLED')} className="text-xs bg-gray-500/10 text-gray-400 px-3 py-1.5 rounded-md hover:bg-gray-500/20 transition-colors ml-auto">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
