import { Op, LocalOp, EntityType } from '../model/types';
import { 
  mergeValues, 
  getMergeRule, 
  requiresConflictResolution,
  MergeStrategy,
  generateConflictMetadata 
} from '../model/merge-rules';

// Deterministic merge engine for conflict resolution
export class MergeEngine {
  
  // Merge multiple ops that modify the same entity field
  static mergeFieldOps(
    entityType: EntityType,
    fieldPath: string,
    ops: Op[]
  ): MergeResult {
    if (ops.length === 0) {
      return { value: undefined, conflicts: [] };
    }
    
    if (ops.length === 1) {
      return { value: ops[0].value, conflicts: [] };
    }
    
    // Sort ops by causal order (lamport clock, then timestamp)
    const sortedOps = ops.sort((a, b) => {
      if (a.lamport !== b.lamport) {
        return a.lamport - b.lamport;
      }
      return a.ts - b.ts;
    });
    
    const rule = getMergeRule(entityType, fieldPath);
    const strategy = rule?.strategy || 'last-write-wins';
    
    let currentValue = sortedOps[0].value;
    const conflicts: ConflictRecord[] = [];
    
    // Apply subsequent ops with merge strategy
    for (let i = 1; i < sortedOps.length; i++) {
      const op = sortedOps[i];
      const mergeResult = mergeValues(strategy, currentValue, op.value, sortedOps);
      
      currentValue = mergeResult.value;
      
      if (mergeResult.conflict) {
        const conflictMetadata = generateConflictMetadata(entityType, fieldPath, sortedOps.slice(0, i + 1));
        conflicts.push({
          ...conflictMetadata,
          currentValue,
          newValue: op.value,
          strategy,
          ops: sortedOps.slice(0, i + 1)
        });
      }
    }
    
    return { value: currentValue, conflicts };
  }
  
  // Merge entire entity state from multiple ops
  static mergeEntityState<T extends Record<string, any>>(
    entityType: EntityType,
    entityId: string,
    ops: Op[]
  ): EntityMergeResult<T> {
    if (ops.length === 0) {
      return { state: {} as T, conflicts: [], version: 0 };
    }
    
    // Group ops by field path
    const opsByPath = new Map<string, Op[]>();
    
    for (const op of ops) {
      if (op.path) {
        if (!opsByPath.has(op.path)) {
          opsByPath.set(op.path, []);
        }
        opsByPath.get(op.path)!.push(op);
      }
    }
    
    // Merge each field
    const mergedState: any = {};
    const allConflicts: ConflictRecord[] = [];
    
    for (const [path, pathOps] of opsByPath) {
      const mergeResult = this.mergeFieldOps(entityType, path, pathOps);
      
      if (mergeResult.value !== undefined) {
        this.setNestedValue(mergedState, path, mergeResult.value);
      }
      
      allConflicts.push(...mergeResult.conflicts);
    }
    
    // Handle create operations (full entity state)
    const createOps = ops.filter(op => op.kind === 'create');
    if (createOps.length > 0) {
      // Use the latest create operation as base state
      const latestCreate = createOps.sort((a, b) => b.ts - a.ts)[0];
      if (latestCreate.value && typeof latestCreate.value === 'object') {
        Object.assign(mergedState, latestCreate.value);
      }
    }
    
    return {
      state: mergedState as T,
      conflicts: allConflicts,
      version: ops.length
    };
  }
  
  // Resolve conflicts automatically based on business rules
  static autoResolveConflicts(conflicts: ConflictRecord[]): ResolvedConflict[] {
    return conflicts.map(conflict => this.autoResolveConflict(conflict));
  }
  
  private static autoResolveConflict(conflict: ConflictRecord): ResolvedConflict {
    const rule = getMergeRule(conflict.entityType, conflict.fieldPath);
    
    // Safety-critical fields always require manual resolution
    if (this.isSafetyCriticalField(conflict.fieldPath)) {
      return {
        ...conflict,
        autoResolved: false,
        resolution: 'manual',
        reason: 'Safety-critical field requires manual review'
      };
    }
    
    // Production metrics - use conservative approach
    if (this.isProductionMetric(conflict.fieldPath)) {
      const resolved = this.resolveProductionConflict(conflict);
      return {
        ...conflict,
        autoResolved: true,
        resolution: 'auto',
        resolvedValue: resolved.value,
        reason: resolved.reason
      };
    }
    
    // Equipment status - use most recent operational data
    if (this.isEquipmentField(conflict.fieldPath)) {
      const resolved = this.resolveEquipmentConflict(conflict);
      return {
        ...conflict,
        autoResolved: true,
        resolution: 'auto',
        resolvedValue: resolved.value,
        reason: resolved.reason
      };
    }
    
    // Default: use merge rule strategy
    const mergeResult = mergeValues(
      conflict.strategy as MergeStrategy,
      conflict.currentValue,
      conflict.newValue,
      conflict.ops
    );
    
    return {
      ...conflict,
      autoResolved: !mergeResult.conflict,
      resolution: mergeResult.conflict ? 'manual' : 'auto',
      resolvedValue: mergeResult.value,
      reason: `Applied ${conflict.strategy} strategy`
    };
  }
  
  private static isSafetyCriticalField(fieldPath: string): boolean {
    const safetyCriticalPaths = [
      'safety.incidents',
      'safety.hazards', 
      'safety.safetyMetrics.totalIncidents',
      'safety.safetyMetrics.daysWithoutIncident'
    ];
    
    return safetyCriticalPaths.some(path => fieldPath.startsWith(path));
  }
  
  private static isProductionMetric(fieldPath: string): boolean {
    return fieldPath.startsWith('production.tonnes.') || 
           fieldPath.startsWith('production.grade.');
  }
  
  private static isEquipmentField(fieldPath: string): boolean {
    return fieldPath.startsWith('equipment.assets') ||
           fieldPath.startsWith('equipment.breakdowns');
  }
  
  private static resolveProductionConflict(conflict: ConflictRecord): { value: any; reason: string } {
    // For production metrics, generally take the higher value
    // as it's more conservative for reporting
    if (typeof conflict.currentValue === 'number' && typeof conflict.newValue === 'number') {
      const maxValue = Math.max(conflict.currentValue, conflict.newValue);
      return {
        value: maxValue,
        reason: 'Used maximum value for conservative production reporting'
      };
    }
    
    return {
      value: conflict.newValue,
      reason: 'Used latest production data'
    };
  }
  
  private static resolveEquipmentConflict(conflict: ConflictRecord): { value: any; reason: string } {
    // For equipment status, prioritize operational data over static data
    if (conflict.fieldPath.includes('status') || conflict.fieldPath.includes('condition')) {
      // If one value indicates a problem (DOWN, POOR, etc.), use that
      const problemStates = ['DOWN', 'MAINTENANCE', 'POOR', 'CRITICAL'];
      
      if (problemStates.includes(String(conflict.newValue))) {
        return {
          value: conflict.newValue,
          reason: 'Prioritized equipment issue status for safety'
        };
      }
      
      if (problemStates.includes(String(conflict.currentValue))) {
        return {
          value: conflict.currentValue,
          reason: 'Preserved equipment issue status for safety'
        };
      }
    }
    
    return {
      value: conflict.newValue,
      reason: 'Used latest equipment data'
    };
  }
  
  // Apply three-way merge for complex conflicts
  static threeWayMerge(
    base: any,
    current: any,
    incoming: any,
    fieldPath: string,
    entityType: EntityType
  ): ThreeWayMergeResult {
    // If base and current are the same, incoming wins
    if (JSON.stringify(base) === JSON.stringify(current)) {
      return { value: incoming, conflict: false };
    }
    
    // If base and incoming are the same, current wins
    if (JSON.stringify(base) === JSON.stringify(incoming)) {
      return { value: current, conflict: false };
    }
    
    // If current and incoming are the same, no conflict
    if (JSON.stringify(current) === JSON.stringify(incoming)) {
      return { value: current, conflict: false };
    }
    
    // All different - apply merge rules
    const rule = getMergeRule(entityType, fieldPath);
    const strategy = rule?.strategy || 'last-write-wins';
    
    const mergeResult = mergeValues(strategy, current, incoming, []);
    
    return {
      value: mergeResult.value,
      conflict: mergeResult.conflict || false
    };
  }
  
  // Utility methods
  private static setNestedValue(obj: any, path: string, value: unknown): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    
    const target = keys.reduce((current, key) => {
      if (!(key in current)) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    
    target[lastKey] = value;
  }
  
  private static getNestedValue(obj: any, path: string): unknown {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
  
  // Conflict resolution scoring
  static scoreConflictResolution(
    entityType: EntityType,
    fieldPath: string,
    strategy: MergeStrategy,
    ops: Op[]
  ): ConflictScore {
    let score = 0;
    let confidence = 1.0;
    let risks: string[] = [];
    
    // Safety criticality increases score
    if (this.isSafetyCriticalField(fieldPath)) {
      score += 100;
      confidence *= 0.5; // Reduce confidence for safety fields
      risks.push('safety-critical');
    }
    
    // More conflicting ops increase complexity
    if (ops.length > 2) {
      score += ops.length * 10;
      confidence *= 0.9;
      risks.push('multiple-conflicts');
    }
    
    // Time spread of ops affects resolution reliability
    const timeSpread = Math.max(...ops.map(op => op.ts)) - Math.min(...ops.map(op => op.ts));
    if (timeSpread > 5 * 60 * 1000) { // > 5 minutes
      score += 20;
      confidence *= 0.8;
      risks.push('time-spread');
    }
    
    // Different actors increase complexity
    const uniqueActors = new Set(ops.map(op => op.actorId)).size;
    if (uniqueActors > 1) {
      score += uniqueActors * 15;
      confidence *= 0.85;
      risks.push('multi-actor');
    }
    
    return {
      score,
      confidence,
      complexity: score > 50 ? 'high' : score > 20 ? 'medium' : 'low',
      risks,
      recommendation: this.getResolutionRecommendation(score, confidence, risks)
    };
  }
  
  private static getResolutionRecommendation(
    score: number,
    confidence: number,
    risks: string[]
  ): string {
    if (score > 100 || confidence < 0.5 || risks.includes('safety-critical')) {
      return 'manual-review-required';
    }
    
    if (score > 50 || confidence < 0.7) {
      return 'manual-review-recommended';
    }
    
    return 'auto-resolve-safe';
  }
}

// Types
export interface MergeResult {
  value: unknown;
  conflicts: ConflictRecord[];
}

export interface EntityMergeResult<T> {
  state: T;
  conflicts: ConflictRecord[];
  version: number;
}

export interface ConflictRecord {
  id: string;
  entityType: EntityType;
  entityId: string;
  fieldPath: string;
  conflictingOps: string[];
  strategy: string;
  timestamp: Date;
  resolved: boolean;
  participants: string[];
  strategies: MergeStrategy[];
  requiresApproval: boolean;
  currentValue?: any;
  newValue?: any;
  ops: Op[];
}

export interface ResolvedConflict extends ConflictRecord {
  autoResolved: boolean;
  resolution: 'auto' | 'manual';
  resolvedValue?: any;
  reason: string;
}

export interface ThreeWayMergeResult {
  value: any;
  conflict: boolean;
}

export interface ConflictScore {
  score: number;
  confidence: number;
  complexity: 'low' | 'medium' | 'high';
  risks: string[];
  recommendation: 'auto-resolve-safe' | 'manual-review-recommended' | 'manual-review-required';
}