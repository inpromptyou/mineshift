import { Op, OpKind, isValidTransition } from './types';

// Field-level merge rules for conflict resolution
// When multiple ops modify the same field, these rules determine the final value

export type MergeStrategy = 
  | 'last-write-wins'     // Simple timestamp-based resolution
  | 'set-union'          // Merge arrays/sets by combining unique items
  | 'additive'           // Sum numerical values
  | 'monotonic'          // Only allow forward progress (status transitions)
  | 'append-only'        // Append to arrays/strings, never overwrite
  | 'max-value'          // Keep the maximum value
  | 'min-value'          // Keep the minimum value
  | 'conflict'           // Require manual resolution

export interface MergeRule {
  entityType: string;
  fieldPath: string;
  strategy: MergeStrategy;
  conflictMetadata?: {
    requiresApproval?: boolean;
    notifyUsers?: string[];
    escalationLevel?: 'low' | 'medium' | 'high';
  };
}

// Comprehensive merge rules for mining operations
export const MERGE_RULES: MergeRule[] = [
  // Shift Status Rules
  {
    entityType: 'shift',
    fieldPath: 'status',
    strategy: 'monotonic' // OPEN -> IN_PROGRESS -> CLOSED (no rollbacks)
  },
  {
    entityType: 'shift',
    fieldPath: 'startTime',
    strategy: 'min-value' // Keep earliest start time
  },
  {
    entityType: 'shift',
    fieldPath: 'endTime',
    strategy: 'max-value' // Keep latest end time
  },
  
  // Safety Section Rules
  {
    entityType: 'shift',
    fieldPath: 'safety.incidents',
    strategy: 'append-only' // Never lose safety incidents
  },
  {
    entityType: 'shift', 
    fieldPath: 'safety.hazards',
    strategy: 'set-union' // Combine all identified hazards
  },
  {
    entityType: 'shift',
    fieldPath: 'safety.toolboxTalks',
    strategy: 'append-only' // Track all toolbox talks
  },
  {
    entityType: 'shift',
    fieldPath: 'safety.ppeIssues',
    strategy: 'set-union' // Combine PPE issues
  },
  {
    entityType: 'shift',
    fieldPath: 'safety.safetyMetrics.totalIncidents',
    strategy: 'max-value' // Keep highest incident count
  },
  {
    entityType: 'shift',
    fieldPath: 'safety.safetyMetrics.nearMisses',
    strategy: 'max-value' // Keep highest near miss count
  },
  {
    entityType: 'shift',
    fieldPath: 'safety.safetyMetrics.complianceScore',
    strategy: 'min-value' // Keep lowest (most conservative) score
  },
  {
    entityType: 'shift',
    fieldPath: 'safety.safetyMetrics.daysWithoutIncident',
    strategy: 'min-value' // Reset if any incident reported
  },
  
  // Production Section Rules
  {
    entityType: 'shift',
    fieldPath: 'production.tonnes.mined',
    strategy: 'max-value' // Keep highest production figure
  },
  {
    entityType: 'shift',
    fieldPath: 'production.tonnes.hauled',
    strategy: 'max-value'
  },
  {
    entityType: 'shift',
    fieldPath: 'production.tonnes.processed', 
    strategy: 'max-value'
  },
  {
    entityType: 'shift',
    fieldPath: 'production.tonnes.target',
    strategy: 'last-write-wins' // Targets can be adjusted
  },
  {
    entityType: 'shift',
    fieldPath: 'production.grade.actual',
    strategy: 'last-write-wins' // Updated with latest samples
  },
  {
    entityType: 'shift',
    fieldPath: 'production.grade.samples',
    strategy: 'max-value' // More samples = better accuracy
  },
  {
    entityType: 'shift',
    fieldPath: 'production.romLevels',
    strategy: 'last-write-wins' // ROM levels are point-in-time readings
  },
  {
    entityType: 'shift',
    fieldPath: 'production.delays',
    strategy: 'append-only' // Track all delays
  },
  
  // Equipment Section Rules
  {
    entityType: 'shift',
    fieldPath: 'equipment.assets',
    strategy: 'last-write-wins' // Asset status is current state
  },
  {
    entityType: 'shift',
    fieldPath: 'equipment.breakdowns',
    strategy: 'set-union' // Combine all breakdown reports
  },
  {
    entityType: 'shift',
    fieldPath: 'equipment.maintenance',
    strategy: 'set-union' // Combine maintenance activities
  },
  {
    entityType: 'shift',
    fieldPath: 'equipment.inspections',
    strategy: 'append-only' // Never lose inspection records
  },
  
  // Issues Section Rules
  {
    entityType: 'shift',
    fieldPath: 'issues.openIssues',
    strategy: 'set-union' // Combine open issues
  },
  {
    entityType: 'shift',
    fieldPath: 'issues.newIssues',
    strategy: 'append-only' // Track all new issues
  },
  {
    entityType: 'shift',
    fieldPath: 'issues.escalations',
    strategy: 'append-only' // Never lose escalation records
  },
  {
    entityType: 'shift',
    fieldPath: 'issues.communications',
    strategy: 'append-only' // Keep communication history
  },
  
  // Action Rules
  {
    entityType: 'action',
    fieldPath: 'status',
    strategy: 'monotonic' // OPEN -> IN_PROGRESS -> CLOSED/CANCELLED
  },
  {
    entityType: 'action',
    fieldPath: 'priority',
    strategy: 'max-value', // Higher priority wins (CRITICAL > HIGH > MEDIUM > LOW)
    conflictMetadata: {
      requiresApproval: true,
      notifyUsers: ['supervisor', 'manager'],
      escalationLevel: 'medium'
    }
  },
  {
    entityType: 'action',
    fieldPath: 'assignedTo',
    strategy: 'last-write-wins' // Can be reassigned
  },
  {
    entityType: 'action',
    fieldPath: 'dueTime',
    strategy: 'min-value' // Earlier due dates take precedence
  },
  {
    entityType: 'action',
    fieldPath: 'evidence',
    strategy: 'append-only' // Never lose evidence
  },
  {
    entityType: 'action',
    fieldPath: 'description',
    strategy: 'last-write-wins' // Can be updated
  },
  
  // Asset Rules
  {
    entityType: 'asset',
    fieldPath: 'status',
    strategy: 'last-write-wins' // Current operational status
  },
  {
    entityType: 'asset',
    fieldPath: 'metrics.operatingHours',
    strategy: 'max-value' // Hours only increase
  },
  {
    entityType: 'asset',
    fieldPath: 'metrics.fuelConsumption',
    strategy: 'additive' // Cumulative fuel consumption
  },
  {
    entityType: 'asset',
    fieldPath: 'lastMaint',
    strategy: 'max-value' // Most recent maintenance date
  },
  {
    entityType: 'asset',
    fieldPath: 'nextMaint',
    strategy: 'min-value' // Earliest required maintenance
  }
];

// Get merge rule for a specific field
export function getMergeRule(entityType: string, fieldPath: string): MergeRule | null {
  return MERGE_RULES.find(rule => 
    rule.entityType === entityType && 
    (rule.fieldPath === fieldPath || fieldPath.startsWith(rule.fieldPath + '.'))
  ) || null;
}

// Apply merge strategy to resolve conflicts
export function mergeValues(
  strategy: MergeStrategy,
  currentValue: unknown,
  newValue: unknown,
  ops: Op[]
): { value: unknown; conflict?: boolean } {
  switch (strategy) {
    case 'last-write-wins':
      return { value: newValue };
      
    case 'set-union':
      if (Array.isArray(currentValue) && Array.isArray(newValue)) {
        const merged = [...currentValue];
        for (const item of newValue) {
          if (!merged.some(existing => JSON.stringify(existing) === JSON.stringify(item))) {
            merged.push(item);
          }
        }
        return { value: merged };
      }
      return { value: newValue };
      
    case 'additive':
      if (typeof currentValue === 'number' && typeof newValue === 'number') {
        return { value: currentValue + newValue };
      }
      return { value: newValue };
      
    case 'monotonic':
      // For status transitions, validate against allowed transitions
      const entityType = ops[0]?.entityType;
      if (entityType && typeof currentValue === 'string' && typeof newValue === 'string') {
        if (isValidTransition(entityType, currentValue, newValue)) {
          return { value: newValue };
        }
        // Invalid transition - keep current value
        return { value: currentValue, conflict: true };
      }
      return { value: newValue };
      
    case 'append-only':
      if (Array.isArray(currentValue)) {
        if (Array.isArray(newValue)) {
          return { value: [...currentValue, ...newValue] };
        }
        return { value: [...currentValue, newValue] };
      }
      if (typeof currentValue === 'string' && typeof newValue === 'string') {
        return { value: currentValue + '\n' + newValue };
      }
      return { value: [currentValue, newValue] };
      
    case 'max-value':
      if (typeof currentValue === 'number' && typeof newValue === 'number') {
        return { value: Math.max(currentValue, newValue) };
      }
      if (currentValue instanceof Date && newValue instanceof Date) {
        return { value: currentValue > newValue ? currentValue : newValue };
      }
      if (typeof currentValue === 'string' && typeof newValue === 'string') {
        // For priority: CRITICAL > HIGH > MEDIUM > LOW
        const priorityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
        const currentPriority = priorityOrder[currentValue as keyof typeof priorityOrder] || 0;
        const newPriority = priorityOrder[newValue as keyof typeof priorityOrder] || 0;
        return { value: newPriority > currentPriority ? newValue : currentValue };
      }
      return { value: newValue };
      
    case 'min-value':
      if (typeof currentValue === 'number' && typeof newValue === 'number') {
        return { value: Math.min(currentValue, newValue) };
      }
      if (currentValue instanceof Date && newValue instanceof Date) {
        return { value: currentValue < newValue ? currentValue : newValue };
      }
      return { value: newValue };
      
    case 'conflict':
      return { value: currentValue, conflict: true };
      
    default:
      return { value: newValue };
  }
}

// Check if a field requires conflict resolution
export function requiresConflictResolution(
  entityType: string,
  fieldPath: string,
  currentValue: unknown,
  newValue: unknown
): boolean {
  const rule = getMergeRule(entityType, fieldPath);
  if (!rule) return false;
  
  // Always require resolution for explicit conflict strategy
  if (rule.strategy === 'conflict') return true;
  
  // Require resolution for monotonic violations
  if (rule.strategy === 'monotonic' && typeof currentValue === 'string' && typeof newValue === 'string') {
    return !isValidTransition(entityType, currentValue, newValue);
  }
  
  // Require resolution if rule has approval requirement
  return rule.conflictMetadata?.requiresApproval || false;
}

// Generate conflict resolution metadata
export function generateConflictMetadata(
  entityType: string,
  fieldPath: string,
  ops: Op[]
): {
  conflictId: string;
  participants: string[];
  strategies: MergeStrategy[];
  timestamp: Date;
  requiresApproval: boolean;
} {
  const rule = getMergeRule(entityType, fieldPath);
  const actors = [...new Set(ops.map(op => op.actorId))];
  
  return {
    conflictId: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    participants: actors,
    strategies: rule ? [rule.strategy] : ['last-write-wins'],
    timestamp: new Date(),
    requiresApproval: rule?.conflictMetadata?.requiresApproval || false
  };
}

// Default merge rule for unknown fields
export const DEFAULT_MERGE_RULE: MergeRule = {
  entityType: '*',
  fieldPath: '*',
  strategy: 'last-write-wins'
};