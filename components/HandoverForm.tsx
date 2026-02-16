'use client';

import { useState } from 'react';

interface Section {
  id: string;
  title: string;
  icon: string;
  fields: Field[];
}

interface Field {
  key: string;
  label: string;
  type: 'number' | 'text' | 'textarea' | 'select';
  unit?: string;
  placeholder?: string;
  options?: string[];
}

const sections: Section[] = [
  {
    id: 'safety',
    title: 'Safety',
    icon: '🛡️',
    fields: [
      { key: 'incidents', label: 'Incidents This Shift', type: 'number', placeholder: '0' },
      { key: 'nearMisses', label: 'Near Misses', type: 'number', placeholder: '0' },
      { key: 'hazards', label: 'New Hazards Identified', type: 'textarea', placeholder: 'Describe any new hazards...' },
      { key: 'toolboxTalk', label: 'Toolbox Talk Topic', type: 'text', placeholder: 'e.g. Working at heights' },
      { key: 'toolboxAttendees', label: 'Toolbox Attendees', type: 'number', placeholder: '0' },
      { key: 'ppeIssues', label: 'PPE Issues', type: 'textarea', placeholder: 'Any PPE concerns...' },
      { key: 'safetySummary', label: 'Safety Summary', type: 'textarea', placeholder: 'Overall safety status for the shift...' },
    ],
  },
  {
    id: 'production',
    title: 'Production',
    icon: '📊',
    fields: [
      { key: 'tonnesMined', label: 'Tonnes Mined', type: 'number', unit: 't', placeholder: '0' },
      { key: 'tonnesHauled', label: 'Tonnes Hauled', type: 'number', unit: 't', placeholder: '0' },
      { key: 'tonnesProcessed', label: 'Tonnes Processed', type: 'number', unit: 't', placeholder: '0' },
      { key: 'tonnesTarget', label: 'Shift Target', type: 'number', unit: 't', placeholder: '0' },
      { key: 'gradeActual', label: 'Grade (Actual)', type: 'number', unit: 'g/t', placeholder: '0.00' },
      { key: 'gradeTarget', label: 'Grade (Target)', type: 'number', unit: 'g/t', placeholder: '0.00' },
      { key: 'romLevel', label: 'ROM Pad Level', type: 'number', unit: '%', placeholder: '0' },
      { key: 'delays', label: 'Production Delays', type: 'textarea', placeholder: 'Describe any delays and causes...' },
      { key: 'productionNotes', label: 'Production Notes', type: 'textarea', placeholder: 'General production notes...' },
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment',
    icon: '🔧',
    fields: [
      { key: 'excavatorsOp', label: 'Excavators Operational', type: 'number', placeholder: '0' },
      { key: 'excavatorsDown', label: 'Excavators Down', type: 'number', placeholder: '0' },
      { key: 'trucksOp', label: 'Trucks Operational', type: 'number', placeholder: '0' },
      { key: 'trucksDown', label: 'Trucks Down', type: 'number', placeholder: '0' },
      { key: 'crusherStatus', label: 'Crusher Status', type: 'select', options: ['Operational', 'Down', 'Maintenance', 'Standby'] },
      { key: 'breakdowns', label: 'Breakdowns', type: 'textarea', placeholder: 'List any breakdowns with asset ID...' },
      { key: 'maintenanceNotes', label: 'Maintenance Notes', type: 'textarea', placeholder: 'Planned or completed maintenance...' },
      { key: 'equipmentNotes', label: 'Equipment Notes', type: 'textarea', placeholder: 'General equipment status...' },
    ],
  },
  {
    id: 'issues',
    title: 'Issues & Actions',
    icon: '⚠️',
    fields: [
      { key: 'newIssues', label: 'New Issues', type: 'textarea', placeholder: 'Describe any new issues raised this shift...' },
      { key: 'escalations', label: 'Escalations', type: 'textarea', placeholder: 'Issues escalated to management...' },
      { key: 'communications', label: 'Key Communications', type: 'textarea', placeholder: 'Important comms sent/received...' },
      { key: 'handoverNotes', label: 'Handover Notes for Next Shift', type: 'textarea', placeholder: 'Critical items for incoming shift...' },
    ],
  },
];

interface HandoverFormProps {
  onSubmit?: (data: Record<string, Record<string, string>>) => void;
  initialData?: Record<string, Record<string, string>>;
}

export default function HandoverForm({ onSubmit, initialData }: HandoverFormProps) {
  const [openSections, setOpenSections] = useState<string[]>(['safety']);
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>(initialData || {});

  const toggleSection = (id: string) => {
    setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const updateField = (sectionId: string, fieldKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [fieldKey]: value },
    }));
  };

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  return (
    <div className="space-y-3">
      {sections.map(section => (
        <div key={section.id} className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{section.icon}</span>
              <span className="text-white font-medium">{section.title}</span>
            </div>
            <svg className={`w-5 h-5 text-gray-500 transition-transform ${openSections.includes(section.id) ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openSections.includes(section.id) && (
            <div className="px-4 pb-4 space-y-4 border-t border-[#2a2a30]">
              {section.fields.map(field => (
                <div key={field.key} className="pt-3">
                  <label className="block text-sm text-gray-400 mb-1.5">
                    {field.label} {field.unit && <span className="text-gray-600">({field.unit})</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[section.id]?.[field.key] || ''}
                      onChange={e => updateField(section.id, field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full bg-[#111114] border border-[#2a2a30] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/50 resize-none"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[section.id]?.[field.key] || ''}
                      onChange={e => updateField(section.id, field.key, e.target.value)}
                      className="w-full bg-[#111114] border border-[#2a2a30] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="">Select...</option>
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[section.id]?.[field.key] || ''}
                      onChange={e => updateField(section.id, field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-[#111114] border border-[#2a2a30] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm font-mono focus:outline-none focus:border-amber-500/50"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg transition-colors text-sm mt-4"
      >
        Save Shift Handover
      </button>
    </div>
  );
}
