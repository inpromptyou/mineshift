import { 
  SafetySection, 
  ProductionSection, 
  EquipmentSection, 
  IssuesSection,
  Shift,
  ShiftType 
} from './types';

// Mining handover templates - structured forms for different mining operations

export interface HandoverTemplate {
  name: string;
  description: string;
  sections: HandoverSectionTemplate[];
  requiredFields: string[];
}

export interface HandoverSectionTemplate {
  id: string;
  name: string;
  description: string;
  fields: HandoverFieldTemplate[];
  required: boolean;
}

export interface HandoverFieldTemplate {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checklist' | 'table';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Standard Mining Handover Template
export const STANDARD_MINING_TEMPLATE: HandoverTemplate = {
  name: "Standard Mining Handover",
  description: "Comprehensive handover for mining operations covering all critical areas",
  sections: [
    {
      id: "safety",
      name: "Safety",
      description: "Safety incidents, hazards, and compliance status",
      required: true,
      fields: [
        {
          id: "incidents",
          name: "incidents",
          type: "table",
          label: "Safety Incidents",
          required: false,
          placeholder: "Record any safety incidents that occurred during the shift"
        },
        {
          id: "hazards",
          name: "hazards", 
          type: "table",
          label: "Identified Hazards",
          required: false,
          placeholder: "Document new hazards identified"
        },
        {
          id: "toolbox_talks",
          name: "toolboxTalks",
          type: "table",
          label: "Toolbox Talks Completed",
          required: false,
          placeholder: "Record toolbox talks conducted"
        },
        {
          id: "ppe_issues",
          name: "ppeIssues",
          type: "table", 
          label: "PPE Issues",
          required: false,
          placeholder: "Document any PPE-related issues or requirements"
        },
        {
          id: "compliance_score",
          name: "safetyMetrics.complianceScore",
          type: "number",
          label: "Safety Compliance Score (%)",
          required: true,
          validation: { min: 0, max: 100 }
        },
        {
          id: "days_without_incident",
          name: "safetyMetrics.daysWithoutIncident",
          type: "number",
          label: "Days Without Incident",
          required: true,
          validation: { min: 0 }
        }
      ]
    },
    {
      id: "production",
      name: "Production",
      description: "Production metrics, targets, and performance",
      required: true,
      fields: [
        {
          id: "tonnes_mined",
          name: "production.tonnes.mined",
          type: "number",
          label: "Tonnes Mined",
          required: true,
          validation: { min: 0 }
        },
        {
          id: "tonnes_hauled",
          name: "production.tonnes.hauled",
          type: "number", 
          label: "Tonnes Hauled",
          required: true,
          validation: { min: 0 }
        },
        {
          id: "tonnes_processed",
          name: "production.tonnes.processed",
          type: "number",
          label: "Tonnes Processed", 
          required: true,
          validation: { min: 0 }
        },
        {
          id: "target_tonnes",
          name: "production.tonnes.target",
          type: "number",
          label: "Target Tonnes",
          required: true,
          validation: { min: 0 }
        },
        {
          id: "grade_actual",
          name: "production.grade.actual",
          type: "number",
          label: "Actual Grade (%)",
          required: true,
          validation: { min: 0, max: 100 }
        },
        {
          id: "grade_target",
          name: "production.grade.target", 
          type: "number",
          label: "Target Grade (%)",
          required: true,
          validation: { min: 0, max: 100 }
        },
        {
          id: "rom_levels",
          name: "production.romLevels",
          type: "table",
          label: "ROM Stockpile Levels",
          required: true,
          placeholder: "Update ROM stockpile levels for all locations"
        },
        {
          id: "delays",
          name: "production.delays",
          type: "table",
          label: "Production Delays",
          required: false,
          placeholder: "Record any delays that impacted production"
        }
      ]
    },
    {
      id: "equipment",
      name: "Equipment",
      description: "Equipment status, breakdowns, and maintenance",
      required: true,
      fields: [
        {
          id: "excavators_operational",
          name: "equipment.assets.excavators.operational",
          type: "number",
          label: "Excavators Operational",
          required: true,
          validation: { min: 0 }
        },
        {
          id: "excavators_down",
          name: "equipment.assets.excavators.down",
          type: "number",
          label: "Excavators Down",
          required: true,
          validation: { min: 0 }
        },
        {
          id: "trucks_operational",
          name: "equipment.assets.trucks.operational",
          type: "number",
          label: "Haul Trucks Operational",
          required: true,
          validation: { min: 0 }
        },
        {
          id: "trucks_down",
          name: "equipment.assets.trucks.down",
          type: "number",
          label: "Haul Trucks Down",
          required: true,
          validation: { min: 0 }
        },
        {
          id: "breakdowns",
          name: "equipment.breakdowns",
          type: "table",
          label: "Equipment Breakdowns",
          required: false,
          placeholder: "Document equipment breakdowns and repair status"
        },
        {
          id: "maintenance",
          name: "equipment.maintenance",
          type: "table", 
          label: "Planned Maintenance",
          required: false,
          placeholder: "Update planned maintenance activities"
        },
        {
          id: "inspections",
          name: "equipment.inspections",
          type: "table",
          label: "Equipment Inspections",
          required: false,
          placeholder: "Record completed inspections and findings"
        }
      ]
    },
    {
      id: "issues",
      name: "Issues & Actions",
      description: "Outstanding issues, new concerns, and action items",
      required: true,
      fields: [
        {
          id: "open_issues",
          name: "issues.openIssues",
          type: "table",
          label: "Open Issues",
          required: false,
          placeholder: "Review and update open issues from previous shifts"
        },
        {
          id: "new_issues",
          name: "issues.newIssues", 
          type: "table",
          label: "New Issues",
          required: false,
          placeholder: "Document new issues identified this shift"
        },
        {
          id: "escalations",
          name: "issues.escalations",
          type: "table",
          label: "Escalations",
          required: false,
          placeholder: "Issues requiring management attention or escalation"
        },
        {
          id: "communications",
          name: "issues.communications",
          type: "table",
          label: "Important Communications",
          required: false,
          placeholder: "Key communications with other shifts, departments, or management"
        }
      ]
    }
  ],
  requiredFields: [
    "safety.safetyMetrics.complianceScore",
    "safety.safetyMetrics.daysWithoutIncident",
    "production.tonnes.mined",
    "production.tonnes.hauled", 
    "production.tonnes.processed",
    "production.tonnes.target",
    "production.grade.actual",
    "production.grade.target",
    "production.romLevels",
    "equipment.assets.excavators.operational",
    "equipment.assets.excavators.down",
    "equipment.assets.trucks.operational",
    "equipment.assets.trucks.down"
  ]
};

// Create empty shift with template structure
export function createEmptyShift(
  shiftId: string,
  siteId: string,
  shiftType: ShiftType,
  createdBy: string,
  template: HandoverTemplate = STANDARD_MINING_TEMPLATE
): Partial<Shift> {
  return {
    shiftId,
    siteId,
    shiftType,
    startTime: new Date(),
    status: "OPEN",
    createdBy,
    createdAt: new Date(),
    lastSyncAt: new Date(),
    version: 1,
    
    // Initialize empty sections based on template
    safety: {
      incidents: [],
      hazards: [],
      toolboxTalks: [],
      ppeIssues: [],
      safetyMetrics: {
        daysWithoutIncident: 0,
        totalIncidents: 0,
        nearMisses: 0,
        complianceScore: 100
      }
    },
    
    production: {
      tonnes: {
        mined: 0,
        hauled: 0,
        processed: 0,
        target: 0,
        variance: 0
      },
      equipment: {
        excavators: { available: 0, operational: 0, down: 0 },
        trucks: { available: 0, operational: 0, down: 0 },
        support: { available: 0, operational: 0, down: 0 }
      },
      romLevels: [],
      grade: {
        target: 0,
        actual: 0,
        variance: 0,
        samples: 0
      },
      delays: []
    },
    
    equipment: {
      assets: [],
      breakdowns: [],
      maintenance: [],
      inspections: []
    },
    
    issues: {
      openIssues: [],
      newIssues: [],
      escalations: [],
      communications: []
    }
  };
}

// Field validation based on template
export function validateFieldValue(
  field: HandoverFieldTemplate,
  value: unknown
): { valid: boolean; error?: string } {
  if (field.required && (value === undefined || value === null || value === '')) {
    return { valid: false, error: `${field.label} is required` };
  }
  
  if (field.type === 'number' && value !== undefined && value !== null && value !== '') {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { valid: false, error: `${field.label} must be a number` };
    }
    
    if (field.validation?.min !== undefined && numValue < field.validation.min) {
      return { valid: false, error: `${field.label} must be at least ${field.validation.min}` };
    }
    
    if (field.validation?.max !== undefined && numValue > field.validation.max) {
      return { valid: false, error: `${field.label} must be at most ${field.validation.max}` };
    }
  }
  
  if (field.type === 'text' || field.type === 'textarea') {
    const strValue = String(value);
    if (field.validation?.pattern) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(strValue)) {
        return { valid: false, error: `${field.label} format is invalid` };
      }
    }
  }
  
  if (field.type === 'select' && field.options && value) {
    if (!field.options.includes(String(value))) {
      return { valid: false, error: `${field.label} must be one of: ${field.options.join(', ')}` };
    }
  }
  
  return { valid: true };
}

// Get all validation errors for a shift
export function validateShift(
  shift: Partial<Shift>,
  template: HandoverTemplate = STANDARD_MINING_TEMPLATE
): string[] {
  const errors: string[] = [];
  
  // Check required fields
  for (const fieldPath of template.requiredFields) {
    const value = getNestedValue(shift, fieldPath);
    if (value === undefined || value === null || value === '') {
      errors.push(`Required field missing: ${fieldPath}`);
    }
  }
  
  return errors;
}

// Helper function to get nested object value by path
function getNestedValue(obj: any, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    return current?.[key];
  }, obj);
}

// Pre-filled templates for different shift types
export const SHIFT_TYPE_DEFAULTS = {
  DAY: {
    production: {
      tonnes: { target: 12000 } // Day shift typically has higher targets
    }
  },
  NIGHT: {
    production: {
      tonnes: { target: 8000 } // Night shift may have reduced targets
    }
  },
  SWING: {
    production: {
      tonnes: { target: 10000 } // Swing shift moderate targets
    }
  }
};

// Export available templates
export const AVAILABLE_TEMPLATES = {
  STANDARD_MINING: STANDARD_MINING_TEMPLATE
  // Could add more specialized templates like:
  // COAL_MINING: {...},
  // OPEN_PIT: {...},
  // UNDERGROUND: {...}
};