import { ulid } from 'ulid';
import CryptoJS from 'crypto-js';
import { 
  Op, 
  LocalOp, 
  EntityType, 
  OpKind, 
  Shift, 
  Action, 
  Asset 
} from '../model/types';
import { ClientDBManager } from '../db/clientDb';
import { mergeValues, getMergeRule, requiresConflictResolution } from '../model/merge-rules';

// Sync engine for offline-first operation-log based synchronization
export class SyncEngine {
  private deviceId: string = '';
  private userId: string = '';
  private lamportClock: number = 0;
  private isOnline: boolean = false;
  private syncInProgress: boolean = false;
  private conflicts: ConflictRecord[] = [];
  
  constructor() {
    this.initializeEngine();
  }
  
  private async initializeEngine(): Promise<void> {
    // Get or create device ID
    this.deviceId = await ClientDBManager.getMetaWithDefault('deviceId', this.generateDeviceId());
    
    // Get current user ID (would come from auth)
    this.userId = await ClientDBManager.getMetaWithDefault('userId', 'anonymous');
    
    // Initialize lamport clock
    this.lamportClock = await ClientDBManager.getMetaWithDefault('lamportClock', 0);
    
    // Check online status
    this.isOnline = navigator.onLine;
    
    // Set up network event listeners
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.triggerSync();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  
  // Create and store a new operation
  async createOp(
    entityType: EntityType,
    entityId: string,
    kind: OpKind,
    path?: string,
    value?: unknown
  ): Promise<LocalOp> {
    // Increment lamport clock
    this.lamportClock++;
    await ClientDBManager.setMeta('lamportClock', this.lamportClock);
    
    // Get previous hash for hash chain
    const prevHash = await this.getLastOpHash();
    
    // Create operation
    const op: LocalOp = {
      opId: ulid(),
      deviceId: this.deviceId,
      actorId: this.userId,
      ts: Date.now(),
      lamport: this.lamportClock,
      entityType,
      entityId,
      kind,
      path,
      value,
      prevHash,
      hash: '',
      pushed: false
    };
    
    // Compute hash for tamper-evidence
    op.hash = this.computeOpHash(op);
    
    // Store operation
    await ClientDBManager.addOp(op);
    
    // Apply operation to local materialized view
    await this.applyOpLocally(op);
    
    // Trigger sync if online
    if (this.isOnline) {
      this.triggerSync();
    }
    
    return op;
  }
  
  // Apply operation to local materialized state
  private async applyOpLocally(op: LocalOp): Promise<void> {
    switch (op.entityType) {
      case 'shift':
        await this.applyShiftOp(op);
        break;
      case 'action':
        await this.applyActionOp(op);
        break;
      case 'asset':
        await this.applyAssetOp(op);
        break;
    }
  }
  
  private async applyShiftOp(op: LocalOp): Promise<void> {
    let shift = await ClientDBManager.getShiftByShiftId(op.entityId);
    
    if (op.kind === 'create') {
      if (!shift) {
        const newShift = op.value as Partial<Shift>;
        await ClientDBManager.createShift({
          id: op.entityId,
          ...newShift
        } as Shift);
      }
      return;
    }
    
    if (!shift) {
      console.warn(`Shift ${op.entityId} not found for operation ${op.opId}`);
      return;
    }
    
    const updates: Partial<Shift> = {};
    
    if (op.kind === 'update' && op.path && op.value !== undefined) {
      // Update specific field
      this.setNestedValue(updates, op.path, op.value);
    } else if (op.kind === 'transition' && op.path === 'status') {
      updates.status = op.value as any;
    } else if (op.kind === 'signoff') {
      updates.status = 'CLOSED';
      updates.endTime = new Date(op.ts);
    }
    
    if (Object.keys(updates).length > 0) {
      await ClientDBManager.updateShift(shift.id, updates);
    }
  }
  
  private async applyActionOp(op: LocalOp): Promise<void> {
    let action = await ClientDBManager.getAction(op.entityId);
    
    if (op.kind === 'create') {
      if (!action) {
        const newAction = op.value as Partial<Action>;
        await ClientDBManager.createAction({
          id: op.entityId,
          ...newAction
        } as Action);
      }
      return;
    }
    
    if (!action) {
      console.warn(`Action ${op.entityId} not found for operation ${op.opId}`);
      return;
    }
    
    const updates: Partial<Action> = {};
    
    if (op.kind === 'update' && op.path && op.value !== undefined) {
      this.setNestedValue(updates, op.path, op.value);
    } else if (op.kind === 'transition' && op.path === 'status') {
      updates.status = op.value as any;
      if (op.value === 'CLOSED') {
        updates.completedAt = new Date(op.ts);
      }
    }
    
    if (Object.keys(updates).length > 0) {
      await ClientDBManager.updateAction(action.id, updates);
    }
  }
  
  private async applyAssetOp(op: LocalOp): Promise<void> {
    let asset = await ClientDBManager.getAsset(op.entityId);
    
    if (op.kind === 'create') {
      if (!asset) {
        const newAsset = op.value as Partial<Asset>;
        await ClientDBManager.createAsset({
          id: op.entityId,
          ...newAsset
        } as Asset);
      }
      return;
    }
    
    if (!asset) {
      console.warn(`Asset ${op.entityId} not found for operation ${op.opId}`);
      return;
    }
    
    const updates: Partial<Asset> = {};
    
    if (op.kind === 'update' && op.path && op.value !== undefined) {
      this.setNestedValue(updates, op.path, op.value);
    }
    
    if (Object.keys(updates).length > 0) {
      await ClientDBManager.updateAsset(asset.id, updates);
    }
  }
  
  // Synchronization methods
  async triggerSync(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) {
      return;
    }
    
    this.syncInProgress = true;
    
    try {
      // Push local ops to server
      await this.pushOps();
      
      // Pull ops from server
      await this.pullOps();
      
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }
  
  private async pushOps(): Promise<void> {
    const unpushedOps = await ClientDBManager.getUnpushedOps();
    
    if (unpushedOps.length === 0) {
      return;
    }
    
    console.log(`Pushing ${unpushedOps.length} ops to server`);
    
    // Convert LocalOp to Op format
    const opsToSend: Op[] = unpushedOps.map(localOp => {
      const { pushed, ...op } = localOp;
      return op;
    });
    
    // Send to server
    const response = await fetch('/api/sync/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ops: opsToSend })
    });
    
    if (!response.ok) {
      throw new Error(`Push failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      // Mark ops as pushed
      const pushedOpIds = opsToSend.map(op => op.opId);
      await ClientDBManager.markOpsPushed(pushedOpIds);
    } else if (result.conflicts) {
      // Handle conflicts
      await this.handleConflicts(result.conflicts);
    }
  }
  
  private async pullOps(): Promise<void> {
    const cursors = await ClientDBManager.getAllSyncCursors();
    
    for (const cursor of cursors) {
      await this.pullOpsForEntity(cursor.entityType, cursor.lastOpId, cursor.lastTimestamp);
    }
  }
  
  private async pullOpsForEntity(
    entityType: EntityType,
    lastOpId: string,
    lastTimestamp: number
  ): Promise<void> {
    const response = await fetch(`/api/sync/pull?entityType=${entityType}&lastOpId=${lastOpId}&lastTimestamp=${lastTimestamp}`);
    
    if (!response.ok) {
      throw new Error(`Pull failed for ${entityType}: ${response.statusText}`);
    }
    
    const result = await response.json();
    const ops: Op[] = result.ops || [];
    
    if (ops.length === 0) {
      return;
    }
    
    console.log(`Pulled ${ops.length} ${entityType} ops from server`);
    
    // Apply ops to local state with conflict resolution
    for (const op of ops) {
      await this.applyRemoteOp(op);
    }
    
    // Update sync cursor
    const lastOp = ops[ops.length - 1];
    await ClientDBManager.updateSyncCursor(
      entityType,
      lastOp.opId,
      lastOp.ts
    );
  }
  
  private async applyRemoteOp(op: Op): Promise<void> {
    // Check if we already have this op
    const existingOps = await ClientDBManager.getOpsSince(op.entityType, op.opId);
    const exists = existingOps.some(existingOp => existingOp.opId === op.opId);
    
    if (exists) {
      return; // Already applied
    }
    
    // Store the remote op
    const localOp: LocalOp = { ...op, pushed: true };
    await ClientDBManager.addOp(localOp);
    
    // Apply with conflict resolution
    await this.applyOpWithConflictResolution(localOp);
  }
  
  private async applyOpWithConflictResolution(op: LocalOp): Promise<void> {
    // Get conflicting ops (same entity, overlapping time window)
    const conflictingOps = await this.getConflictingOps(op);
    
    if (conflictingOps.length === 0) {
      // No conflicts, apply directly
      await this.applyOpLocally(op);
      return;
    }
    
    // Resolve conflicts using merge rules
    await this.resolveConflicts(op, conflictingOps);
  }
  
  private async getConflictingOps(op: LocalOp): Promise<LocalOp[]> {
    const timeWindow = 5 * 60 * 1000; // 5 minutes
    const startTime = op.ts - timeWindow;
    const endTime = op.ts + timeWindow;
    
    // Find ops in the same entity and time window
    const allOps = await ClientDBManager.getOpsSince(op.entityType);
    
    return allOps.filter(existingOp => 
      existingOp.entityId === op.entityId &&
      existingOp.ts >= startTime &&
      existingOp.ts <= endTime &&
      existingOp.opId !== op.opId &&
      this.opsConflict(op, existingOp)
    );
  }
  
  private opsConflict(op1: LocalOp, op2: LocalOp): boolean {
    // Ops conflict if they modify the same path
    return op1.path === op2.path || 
           (op1.path && op2.path && 
            (op1.path.startsWith(op2.path + '.') || 
             op2.path.startsWith(op1.path + '.')));
  }
  
  private async resolveConflicts(newOp: LocalOp, conflictingOps: LocalOp[]): Promise<void> {
    const allOps = [...conflictingOps, newOp].sort((a, b) => {
      // Sort by lamport clock first, then timestamp
      if (a.lamport !== b.lamport) {
        return a.lamport - b.lamport;
      }
      return a.ts - b.ts;
    });
    
    // Build final state by applying ops in causal order
    let finalState: any = {};
    
    for (const op of allOps) {
      if (op.path && op.value !== undefined) {
        const rule = getMergeRule(op.entityType, op.path);
        const strategy = rule?.strategy || 'last-write-wins';
        
        const currentValue = this.getNestedValue(finalState, op.path);
        const mergeResult = mergeValues(strategy, currentValue, op.value, allOps);
        
        if (mergeResult.conflict) {
          // Record conflict for manual resolution
          this.conflicts.push({
            id: ulid(),
            entityType: op.entityType,
            entityId: op.entityId,
            fieldPath: op.path,
            conflictingOps: allOps.map(o => o.opId),
            strategy,
            timestamp: new Date(),
            resolved: false
          });
        }
        
        this.setNestedValue(finalState, op.path, mergeResult.value);
      }
    }
    
    // Apply final merged state
    await this.applyMergedState(newOp.entityType, newOp.entityId, finalState);
  }
  
  private async applyMergedState(entityType: EntityType, entityId: string, state: any): Promise<void> {
    switch (entityType) {
      case 'shift':
        const shift = await ClientDBManager.getShiftByShiftId(entityId);
        if (shift) {
          await ClientDBManager.updateShift(shift.id, state);
        }
        break;
      case 'action':
        const action = await ClientDBManager.getAction(entityId);
        if (action) {
          await ClientDBManager.updateAction(action.id, state);
        }
        break;
      case 'asset':
        const asset = await ClientDBManager.getAsset(entityId);
        if (asset) {
          await ClientDBManager.updateAsset(asset.id, state);
        }
        break;
    }
  }
  
  private async handleConflicts(conflicts: any[]): Promise<void> {
    console.log(`Handling ${conflicts.length} conflicts`);
    
    for (const conflict of conflicts) {
      this.conflicts.push({
        id: conflict.id,
        entityType: conflict.entityType,
        entityId: conflict.entityId,
        fieldPath: conflict.fieldPath,
        conflictingOps: conflict.conflictingOps,
        strategy: conflict.strategy,
        timestamp: new Date(conflict.timestamp),
        resolved: false
      });
    }
  }
  
  // Utility methods
  private async getLastOpHash(): Promise<string | undefined> {
    const lastOp = await ClientDBManager.getUnpushedOps();
    if (lastOp.length === 0) {
      const allOps = await ClientDBManager.getOpsSince('shift', ''); // Get any recent op
      return allOps.length > 0 ? allOps[allOps.length - 1].hash : undefined;
    }
    return lastOp[lastOp.length - 1].hash;
  }
  
  private computeOpHash(op: Omit<LocalOp, 'hash' | 'pushed'>): string {
    const data = `${op.opId}|${op.deviceId}|${op.actorId}|${op.ts}|${op.lamport}|${op.entityType}|${op.entityId}|${op.kind}|${op.path}|${JSON.stringify(op.value)}|${op.prevHash}`;
    return CryptoJS.SHA256(data).toString();
  }
  
  private generateDeviceId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 9);
    return `device_${timestamp}_${randomPart}`;
  }
  
  private getNestedValue(obj: any, path: string): unknown {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
  
  private setNestedValue(obj: any, path: string, value: unknown): void {
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
  
  // Public API
  async getSyncStatus(): Promise<{
    isOnline: boolean;
    syncInProgress: boolean;
    pendingOps: number;
    lastSync: Date | null;
    conflicts: number;
  }> {
    const pendingOps = (await ClientDBManager.getUnpushedOps()).length;
    const lastSync = await ClientDBManager.getMeta<Date>('lastSync');
    
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      pendingOps,
      lastSync,
      conflicts: this.conflicts.filter(c => !c.resolved).length
    };
  }
  
  async getConflicts(): Promise<ConflictRecord[]> {
    return this.conflicts.filter(c => !c.resolved);
  }
  
  async resolveConflict(conflictId: string, resolution: 'accept' | 'reject'): Promise<void> {
    const conflict = this.conflicts.find(c => c.id === conflictId);
    if (conflict) {
      conflict.resolved = true;
      // Apply resolution logic here
    }
  }
  
  // Force sync (for manual triggers)
  async forcSync(): Promise<void> {
    await this.triggerSync();
  }
}

// Conflict record type
export interface ConflictRecord {
  id: string;
  entityType: EntityType;
  entityId: string;
  fieldPath: string;
  conflictingOps: string[];
  strategy: string;
  timestamp: Date;
  resolved: boolean;
}

// Export singleton instance
export const syncEngine = new SyncEngine();