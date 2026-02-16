import { ulid } from 'ulid';

// Core Op-Log Types
export interface Op {
  opId: string;        // ULID
  deviceId: string;
  actorId: string;
  ts: number;          // client timestamp (milliseconds)
  lamport: number;     // logical clock
  entityType: EntityType;
  entityId: string;
  kind: OpKind;
  path?: string;       // e.g. "production.tonnes"
  value?: unknown;
  prevHash?: string;   // hash chain for tamper-evidence
  hash: string;
}

export interface LocalOp extends Op {
  pushed: boolean;     // has this op been pushed to server?
}

export type EntityType = "shift" | "action" | "entry" | "asset";
export type OpKind = "create" | "update" | "append" | "transition" | "signoff";

// User & Site Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  siteId: string;
}

export type UserRole = "OPERATOR" | "SUPERVISOR" | "MANAGER" | "ADMIN";

export interface Site {
  id: string;
  name: string;
  region: string;
  timezone: string;
}

// Shift Types
export interface Shift {
  id: string;
  shiftId: string;     // business key
  siteId: string;
  shiftType: ShiftType;
  startTime: Date;
  endTime?: Date;
  status: ShiftStatus;
  
  // Handover sections
  safety: SafetySection;
  production: ProductionSection;
  equipment: EquipmentSection;
  issues: IssuesSection;
  
  // Meta
  createdBy: string;
  createdAt: Date;
  lastSyncAt: Date;
  version: number;
}

export type ShiftType = "DAY" | "NIGHT" | "SWING";
export type ShiftStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

// Handover Section Types
export interface SafetySection {
  incidents: Incident[];
  hazards: Hazard[];
  toolboxTalks: ToolboxTalk[];
  ppeIssues: PPEIssue[];
  safetyMetrics: SafetyMetrics;
}

export interface Incident {
  id: string;
  type: IncidentType;
  severity: Severity;
  description: string;
  location: string;
  timeReported: Date;
  reportedBy: string;
  status: IncidentStatus;
  actions: string[];
}

export type IncidentType = "INJURY" | "NEAR_MISS" | "PROPERTY_DAMAGE" | "ENVIRONMENTAL";
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IncidentStatus = "REPORTED" | "INVESTIGATING" | "CLOSED";

export interface Hazard {
  id: string;
  description: string;
  location: string;
  riskLevel: Severity;
  controls: string[];
  identifiedBy: string;
  timeIdentified: Date;
}

export interface ToolboxTalk {
  id: string;
  topic: string;
  duration: number; // minutes
  attendees: string[];
  presenter: string;
  notes?: string;
  timeCompleted: Date;
}

export interface PPEIssue {
  id: string;
  equipment: string;
  issue: string;
  affectedPersonnel: string[];
  resolution: string;
  resolvedAt?: Date;
}

export interface SafetyMetrics {
  daysWithoutIncident: number;
  totalIncidents: number;
  nearMisses: number;
  complianceScore: number; // 0-100
}

export interface ProductionSection {
  tonnes: ProductionTonnes;
  equipment: ProductionEquipment;
  romLevels: ROMLevel[];
  grade: GradeData;
  delays: ProductionDelay[];
}

export interface ProductionTonnes {
  mined: number;
  hauled: number;
  processed: number;
  target: number;
  variance: number;
}

export interface ProductionEquipment {
  excavators: EquipmentCount;
  trucks: EquipmentCount;
  support: EquipmentCount;
}

export interface EquipmentCount {
  available: number;
  operational: number;
  down: number;
}

export interface ROMLevel {
  location: string;
  level: number; // percentage
  capacity: number; // tonnes
  lastUpdated: Date;
}

export interface GradeData {
  target: number;
  actual: number;
  variance: number;
  samples: number;
}

export interface ProductionDelay {
  id: string;
  reason: string;
  duration: number; // minutes
  impact: number; // tonnes lost
  startTime: Date;
  endTime?: Date;
}

export interface EquipmentSection {
  assets: AssetStatus[];
  breakdowns: Breakdown[];
  maintenance: MaintenanceItem[];
  inspections: Inspection[];
}

export interface AssetStatus {
  assetId: string;
  name: string;
  area: string;
  status: AssetStatusType;
  condition: AssetCondition;
  operatingHours: number;
  lastService: Date;
  nextService: Date;
  notes?: string;
}

export type AssetStatusType = "OPERATIONAL" | "DOWN" | "MAINTENANCE" | "STANDBY";
export type AssetCondition = "GOOD" | "FAIR" | "POOR" | "CRITICAL";

export interface Breakdown {
  id: string;
  assetId: string;
  description: string;
  severity: Severity;
  startTime: Date;
  endTime?: Date;
  repairActions: string[];
  spareParts: string[];
  cost?: number;
}

export interface MaintenanceItem {
  id: string;
  assetId: string;
  type: MaintenanceType;
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  technician?: string;
  status: MaintenanceStatus;
}

export type MaintenanceType = "PREVENTIVE" | "CORRECTIVE" | "PREDICTIVE" | "EMERGENCY";
export type MaintenanceStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED";

export interface Inspection {
  id: string;
  assetId: string;
  inspector: string;
  type: string;
  findings: InspectionFinding[];
  completedAt: Date;
}

export interface InspectionFinding {
  item: string;
  condition: AssetCondition;
  notes?: string;
  actionRequired?: boolean;
}

export interface IssuesSection {
  openIssues: Issue[];
  newIssues: Issue[];
  escalations: Escalation[];
  communications: Communication[];
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: Priority;
  status: IssueStatus;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  dueDate?: Date;
  resolution?: string;
  resolvedAt?: Date;
}

export type IssueCategory = "SAFETY" | "PRODUCTION" | "EQUIPMENT" | "ENVIRONMENT" | "HR" | "OTHER";
export type IssueStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Escalation {
  id: string;
  issueId: string;
  escalatedTo: string;
  escalatedBy: string;
  reason: string;
  escalatedAt: Date;
  response?: string;
  respondedAt?: Date;
}

export interface Communication {
  id: string;
  type: CommunicationType;
  recipient: string;
  message: string;
  sentBy: string;
  sentAt: Date;
  acknowledged?: boolean;
  acknowledgedAt?: Date;
}

export type CommunicationType = "EMAIL" | "SMS" | "RADIO" | "PHONE" | "INTERNAL";

// Action Types
export interface Action {
  id: string;
  shiftId?: string;
  title: string;
  description?: string;
  priority: Priority;
  status: ActionStatus;
  dueTime?: Date;
  category?: string;
  assignedTo: string;
  assignedBy: string;
  evidence?: Evidence[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type ActionStatus = "OPEN" | "IN_PROGRESS" | "CLOSED" | "CANCELLED";

export interface Evidence {
  id: string;
  type: EvidenceType;
  filename: string;
  url: string;
  description?: string;
  capturedAt: Date;
  capturedBy: string;
}

export type EvidenceType = "PHOTO" | "VIDEO" | "DOCUMENT" | "AUDIO";

// Asset Types
export interface Asset {
  id: string;
  name: string;
  area: string;
  assetType: AssetType;
  status: AssetStatusType;
  siteId: string;
  model?: string;
  serialNo?: string;
  lastMaint?: Date;
  nextMaint?: Date;
  metrics: AssetMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export type AssetType = "EXCAVATOR" | "HAUL_TRUCK" | "DRILL" | "DOZER" | "LOADER" | "CRUSHER" | "CONVEYOR" | "OTHER";

export interface AssetMetrics {
  operatingHours: number;
  fuelConsumption: number;
  availability: number; // percentage
  utilization: number; // percentage
  efficiency: number; // percentage
  lastReading: Date;
}

// Section Entry for dynamic handover sections
export interface SectionEntry {
  id: string;
  sectionType: string;
  fieldName: string;
  value: unknown;
  timestamp: Date;
  author: string;
}

// Sync & Meta Types
export interface SyncCursor {
  entityType: EntityType;
  lastOpId: string;
  lastTimestamp: number;
}

export interface SyncMeta {
  deviceId: string;
  lastSync: Date;
  cursors: SyncCursor[];
  pendingOps: number;
}

export interface DeviceInfo {
  deviceId: string;
  userAgent: string;
  userId: string;
  lastSeen: Date;
}

// Utility functions for creating entities
export function createOpId(): string {
  return ulid();
}

export function createShiftId(sitePrefix: string, shiftType: ShiftType, date: Date): string {
  const dateStr = date.toISOString().substring(0, 10).replace(/-/g, '');
  const shift = shiftType.substring(0, 1);
  return `${sitePrefix}-${dateStr}-${shift}`;
}

export function createHash(data: string): string {
  // Simple hash function - in production, use proper crypto
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

// Status transition validation
export const STATUS_TRANSITIONS: Record<string, Record<string, string[]>> = {
  shift: {
    OPEN: ["IN_PROGRESS"],
    IN_PROGRESS: ["CLOSED"],
    CLOSED: [] // Final state
  },
  action: {
    OPEN: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["CLOSED", "CANCELLED"],
    CLOSED: [],
    CANCELLED: []
  }
};

export function isValidTransition(entityType: string, from: string, to: string): boolean {
  const transitions = STATUS_TRANSITIONS[entityType];
  if (!transitions || !transitions[from]) return false;
  return transitions[from].includes(to);
}