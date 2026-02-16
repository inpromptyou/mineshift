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

// Hospitality Handover Template
export const HOSPITALITY_TEMPLATE: HandoverTemplate = {
  name: "Hospitality Handover",
  description: "Shift handover for hotels, restaurants, and hospitality venues",
  sections: [
    {
      id: "guest_services",
      name: "Guest Services",
      description: "Guest issues, VIPs, complaints, and special requests",
      required: true,
      fields: [
        { id: "vip_guests", name: "vipGuests", type: "table", label: "VIP Guests / Special Requests", required: false, placeholder: "Note VIP arrivals, special requests, dietary needs" },
        { id: "complaints", name: "complaints", type: "table", label: "Guest Complaints", required: false, placeholder: "Open complaints and resolution status" },
        { id: "occupancy", name: "occupancy", type: "number", label: "Occupancy (%)", required: true, validation: { min: 0, max: 100 } },
      ]
    },
    {
      id: "operations",
      name: "Operations",
      description: "F&B, housekeeping, front desk status",
      required: true,
      fields: [
        { id: "covers", name: "covers", type: "number", label: "Covers Served", required: false, validation: { min: 0 } },
        { id: "housekeeping_status", name: "housekeepingStatus", type: "textarea", label: "Housekeeping Status", required: false, placeholder: "Rooms cleaned, pending, out of order" },
        { id: "maintenance_issues", name: "maintenanceIssues", type: "table", label: "Maintenance Issues", required: false },
      ]
    },
    {
      id: "safety",
      name: "Safety & Incidents",
      description: "Safety, incidents, and compliance",
      required: true,
      fields: [
        { id: "incidents", name: "incidents", type: "table", label: "Incidents", required: false },
        { id: "food_safety", name: "foodSafety", type: "checklist", label: "Food Safety Checks", required: false },
      ]
    },
    {
      id: "issues",
      name: "Issues & Handover Notes",
      description: "Outstanding items for next shift",
      required: true,
      fields: [
        { id: "open_issues", name: "openIssues", type: "table", label: "Open Issues", required: false },
        { id: "handover_notes", name: "handoverNotes", type: "textarea", label: "Handover Notes", required: false, placeholder: "Key info for incoming shift" },
      ]
    }
  ],
  requiredFields: ["guest_services.occupancy"]
};

// Healthcare Handover Template
export const HEALTHCARE_TEMPLATE: HandoverTemplate = {
  name: "Healthcare Handover",
  description: "Clinical shift handover for hospitals, aged care, and clinics",
  sections: [
    {
      id: "patient_status",
      name: "Patient Status",
      description: "Census, acuity, admissions, discharges",
      required: true,
      fields: [
        { id: "census", name: "census", type: "number", label: "Current Census", required: true, validation: { min: 0 } },
        { id: "admissions", name: "admissions", type: "table", label: "Admissions This Shift", required: false },
        { id: "discharges", name: "discharges", type: "table", label: "Discharges This Shift", required: false },
        { id: "high_acuity", name: "highAcuity", type: "table", label: "High Acuity Patients", required: false },
      ]
    },
    {
      id: "clinical",
      name: "Clinical",
      description: "Medications, procedures, escalations",
      required: true,
      fields: [
        { id: "medication_issues", name: "medicationIssues", type: "table", label: "Medication Issues", required: false },
        { id: "procedures", name: "procedures", type: "table", label: "Pending Procedures", required: false },
        { id: "escalations", name: "escalations", type: "table", label: "Clinical Escalations", required: false },
      ]
    },
    {
      id: "safety",
      name: "Safety & Compliance",
      description: "Incidents, falls, infection control",
      required: true,
      fields: [
        { id: "incidents", name: "incidents", type: "table", label: "Incidents / Near Misses", required: false },
        { id: "falls", name: "falls", type: "number", label: "Falls This Shift", required: false, validation: { min: 0 } },
        { id: "infection_control", name: "infectionControl", type: "textarea", label: "Infection Control Notes", required: false },
      ]
    },
    {
      id: "staffing",
      name: "Staffing & Issues",
      description: "Staffing, equipment, outstanding items",
      required: true,
      fields: [
        { id: "staffing_notes", name: "staffingNotes", type: "textarea", label: "Staffing Notes", required: false },
        { id: "equipment_issues", name: "equipmentIssues", type: "table", label: "Equipment Issues", required: false },
        { id: "handover_notes", name: "handoverNotes", type: "textarea", label: "Handover Notes", required: false },
      ]
    }
  ],
  requiredFields: ["patient_status.census"]
};

// Manufacturing Handover Template
export const MANUFACTURING_TEMPLATE: HandoverTemplate = {
  name: "Manufacturing Handover",
  description: "Production line shift handover for manufacturing operations",
  sections: [
    {
      id: "production",
      name: "Production",
      description: "Output, targets, quality, downtime",
      required: true,
      fields: [
        { id: "units_produced", name: "unitsProduced", type: "number", label: "Units Produced", required: true, validation: { min: 0 } },
        { id: "target_units", name: "targetUnits", type: "number", label: "Target Units", required: true, validation: { min: 0 } },
        { id: "defect_rate", name: "defectRate", type: "number", label: "Defect Rate (%)", required: false, validation: { min: 0, max: 100 } },
        { id: "downtime_minutes", name: "downtimeMinutes", type: "number", label: "Downtime (minutes)", required: false, validation: { min: 0 } },
        { id: "delays", name: "delays", type: "table", label: "Production Delays", required: false },
      ]
    },
    {
      id: "equipment",
      name: "Equipment",
      description: "Machine status, breakdowns, maintenance",
      required: true,
      fields: [
        { id: "machines_running", name: "machinesRunning", type: "number", label: "Machines Running", required: true, validation: { min: 0 } },
        { id: "machines_down", name: "machinesDown", type: "number", label: "Machines Down", required: true, validation: { min: 0 } },
        { id: "breakdowns", name: "breakdowns", type: "table", label: "Breakdowns", required: false },
        { id: "maintenance", name: "maintenance", type: "table", label: "Planned Maintenance", required: false },
      ]
    },
    {
      id: "safety",
      name: "Safety & Quality",
      description: "Safety incidents, quality holds, compliance",
      required: true,
      fields: [
        { id: "incidents", name: "incidents", type: "table", label: "Safety Incidents", required: false },
        { id: "quality_holds", name: "qualityHolds", type: "table", label: "Quality Holds", required: false },
        { id: "compliance_checks", name: "complianceChecks", type: "checklist", label: "Compliance Checks", required: false },
      ]
    },
    {
      id: "issues",
      name: "Issues & Actions",
      description: "Open issues and handover items",
      required: true,
      fields: [
        { id: "open_issues", name: "openIssues", type: "table", label: "Open Issues", required: false },
        { id: "handover_notes", name: "handoverNotes", type: "textarea", label: "Handover Notes", required: false },
      ]
    }
  ],
  requiredFields: ["production.unitsProduced", "production.targetUnits", "equipment.machinesRunning", "equipment.machinesDown"]
};

// Trades Handover Template
export const TRADES_TEMPLATE: HandoverTemplate = {
  name: "Trades Handover",
  description: "Shift handover for electricians, plumbers, HVAC, and construction trades",
  sections: [
    {
      id: "jobs",
      name: "Jobs",
      description: "Jobs completed, in progress, and upcoming",
      required: true,
      fields: [
        { id: "jobs_completed", name: "jobsCompleted", type: "number", label: "Jobs Completed", required: true, validation: { min: 0 } },
        { id: "jobs_in_progress", name: "jobsInProgress", type: "table", label: "Jobs In Progress", required: false },
        { id: "jobs_upcoming", name: "jobsUpcoming", type: "table", label: "Upcoming Jobs", required: false },
        { id: "callbacks", name: "callbacks", type: "table", label: "Callbacks / Rework", required: false },
      ]
    },
    {
      id: "safety",
      name: "Safety",
      description: "Safety, permits, isolation status",
      required: true,
      fields: [
        { id: "incidents", name: "incidents", type: "table", label: "Safety Incidents", required: false },
        { id: "permits", name: "permits", type: "table", label: "Active Permits", required: false },
        { id: "isolations", name: "isolations", type: "table", label: "Active Isolations", required: false },
      ]
    },
    {
      id: "materials",
      name: "Materials & Equipment",
      description: "Stock, tools, vehicle status",
      required: false,
      fields: [
        { id: "materials_needed", name: "materialsNeeded", type: "table", label: "Materials Needed", required: false },
        { id: "equipment_issues", name: "equipmentIssues", type: "table", label: "Equipment / Vehicle Issues", required: false },
      ]
    },
    {
      id: "issues",
      name: "Issues & Notes",
      description: "Handover items for next shift",
      required: true,
      fields: [
        { id: "open_issues", name: "openIssues", type: "table", label: "Open Issues", required: false },
        { id: "handover_notes", name: "handoverNotes", type: "textarea", label: "Handover Notes", required: false },
      ]
    }
  ],
  requiredFields: ["jobs.jobsCompleted"]
};

// Retail Handover Template
export const RETAIL_TEMPLATE: HandoverTemplate = {
  name: "Retail Handover",
  description: "Shift handover for retail stores and distribution",
  sections: [
    {
      id: "sales",
      name: "Sales",
      description: "Revenue, transactions, targets",
      required: true,
      fields: [
        { id: "revenue", name: "revenue", type: "number", label: "Revenue ($)", required: true, validation: { min: 0 } },
        { id: "transactions", name: "transactions", type: "number", label: "Transactions", required: false, validation: { min: 0 } },
        { id: "target", name: "target", type: "number", label: "Target ($)", required: false, validation: { min: 0 } },
      ]
    },
    {
      id: "operations",
      name: "Operations",
      description: "Stock, deliveries, displays, customer issues",
      required: true,
      fields: [
        { id: "deliveries", name: "deliveries", type: "table", label: "Deliveries Received / Expected", required: false },
        { id: "stock_issues", name: "stockIssues", type: "table", label: "Stock Issues / Out of Stock", required: false },
        { id: "customer_issues", name: "customerIssues", type: "table", label: "Customer Issues", required: false },
      ]
    },
    {
      id: "safety",
      name: "Safety & Security",
      description: "Incidents, theft, safety",
      required: true,
      fields: [
        { id: "incidents", name: "incidents", type: "table", label: "Incidents", required: false },
        { id: "theft_loss", name: "theftLoss", type: "table", label: "Theft / Loss Prevention", required: false },
      ]
    },
    {
      id: "issues",
      name: "Issues & Notes",
      description: "Handover items",
      required: true,
      fields: [
        { id: "open_issues", name: "openIssues", type: "table", label: "Open Issues", required: false },
        { id: "handover_notes", name: "handoverNotes", type: "textarea", label: "Handover Notes", required: false },
      ]
    }
  ],
  requiredFields: ["sales.revenue"]
};

// Export available templates
export const AVAILABLE_TEMPLATES: Record<string, HandoverTemplate> = {
  STANDARD_MINING: STANDARD_MINING_TEMPLATE,
  HOSPITALITY: HOSPITALITY_TEMPLATE,
  HEALTHCARE: HEALTHCARE_TEMPLATE,
  MANUFACTURING: MANUFACTURING_TEMPLATE,
  TRADES: TRADES_TEMPLATE,
  RETAIL: RETAIL_TEMPLATE,
};