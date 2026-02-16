import Dexie, { Table } from 'dexie';
import { 
  LocalOp, 
  Shift, 
  Action, 
  Asset, 
  SyncCursor, 
  DeviceInfo,
  EntityType 
} from '../model/types';

// IndexedDB schema for offline-first operation
export interface ClientDatabase extends Dexie {
  // Op-log tables
  ops: Table<LocalOp>;
  
  // Materialized entity tables (current state)
  shifts: Table<Shift>;
  actions: Table<Action>;
  assets: Table<Asset>;
  
  // Sync metadata
  cursors: Table<SyncCursor>;
  deviceInfo: Table<DeviceInfo>;
  
  // Application metadata
  meta: Table<{ key: string; value: unknown; updatedAt: Date }>;
}

class MineShiftDB extends Dexie implements ClientDatabase {
  // Op-log table
  ops!: Table<LocalOp>;
  
  // Materialized views
  shifts!: Table<Shift>;
  actions!: Table<Action>; 
  assets!: Table<Asset>;
  
  // Sync tables
  cursors!: Table<SyncCursor>;
  deviceInfo!: Table<DeviceInfo>;
  
  // Meta table
  meta!: Table<{ key: string; value: unknown; updatedAt: Date }>;
  
  constructor() {
    super('MineShiftDB');
    
    this.version(1).stores({
      // Op-log with indexes for sync and query performance
      ops: 'opId, deviceId, actorId, ts, lamport, entityType, entityId, kind, pushed, receivedAt',
      
      // Materialized entity tables
      shifts: 'id, shiftId, siteId, shiftType, startTime, endTime, status, createdBy, createdAt, lastSyncAt',
      actions: 'id, shiftId, title, priority, status, assignedTo, assignedBy, dueTime, createdAt, updatedAt',
      assets: 'id, name, area, assetType, status, siteId, lastMaint, nextMaint, createdAt, updatedAt',
      
      // Sync metadata
      cursors: 'entityType, lastOpId, lastTimestamp',
      deviceInfo: 'deviceId, userId, lastSeen',
      
      // Application metadata
      meta: 'key, value, updatedAt'
    });
    
    // Add hooks for automatic timestamp updates
    this.shifts.hook('creating', function (primKey, obj: any, trans) {
      obj.createdAt = new Date();
      obj.lastSyncAt = new Date();
    });
    
    this.shifts.hook('updating', function (modifications: any, primKey, obj, trans) {
      modifications.lastSyncAt = new Date();
    });
    
    this.actions.hook('creating', function (primKey, obj: any, trans) {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });
    
    this.actions.hook('updating', function (modifications: any, primKey, obj, trans) {
      modifications.updatedAt = new Date();
    });
    
    this.assets.hook('creating', function (primKey, obj: any, trans) {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });
    
    this.assets.hook('updating', function (modifications: any, primKey, obj, trans) {
      modifications.updatedAt = new Date();
    });
  }
}

// Singleton instance
export const clientDb = new MineShiftDB();

// Utility functions for common operations
export class ClientDBManager {
  
  // Op-log operations
  static async addOp(op: LocalOp): Promise<void> {
    await clientDb.ops.add(op);
  }
  
  static async getUnpushedOps(): Promise<LocalOp[]> {
    return clientDb.ops.where('pushed').equals(0).toArray();
  }
  
  static async markOpsPushed(opIds: string[]): Promise<void> {
    await clientDb.ops.where('opId').anyOf(opIds).modify({ pushed: true });
  }
  
  static async getOpsSince(entityType: EntityType, lastOpId?: string): Promise<LocalOp[]> {
    let collection = clientDb.ops.where('entityType').equals(entityType);
    
    if (lastOpId) {
      // Find ops after the given opId by timestamp
      const lastOp = await clientDb.ops.where('opId').equals(lastOpId).first();
      if (lastOp) {
        collection = collection.and(op => op.ts > lastOp.ts);
      }
    }
    
    return collection.sortBy('ts');
  }
  
  // Shift operations
  static async createShift(shift: Shift): Promise<string> {
    return clientDb.shifts.add(shift);
  }
  
  static async updateShift(id: string, updates: Partial<Shift>): Promise<void> {
    await clientDb.shifts.update(id, updates);
  }
  
  static async getShift(id: string): Promise<Shift | undefined> {
    return clientDb.shifts.get(id);
  }
  
  static async getShiftByShiftId(shiftId: string): Promise<Shift | undefined> {
    return clientDb.shifts.where('shiftId').equals(shiftId).first();
  }
  
  static async getRecentShifts(siteId: string, limit = 10): Promise<Shift[]> {
    const shifts = await clientDb.shifts
      .where('siteId')
      .equals(siteId)
      .toArray();
    return shifts
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, limit);
  }
  
  static async getActiveShifts(siteId: string): Promise<Shift[]> {
    return clientDb.shifts
      .where(['siteId', 'status'])
      .equals([siteId, 'OPEN'])
      .or('status')
      .equals('IN_PROGRESS')
      .toArray();
  }
  
  // Action operations
  static async createAction(action: Action): Promise<string> {
    return clientDb.actions.add(action);
  }
  
  static async updateAction(id: string, updates: Partial<Action>): Promise<void> {
    await clientDb.actions.update(id, updates);
  }
  
  static async getAction(id: string): Promise<Action | undefined> {
    return clientDb.actions.get(id);
  }
  
  static async getActionsByShift(shiftId: string): Promise<Action[]> {
    return clientDb.actions.where('shiftId').equals(shiftId).toArray();
  }
  
  static async getActionsByAssignee(assignedTo: string): Promise<Action[]> {
    return clientDb.actions.where('assignedTo').equals(assignedTo).toArray();
  }
  
  static async getOverdueActions(): Promise<Action[]> {
    const now = new Date();
    return clientDb.actions
      .where('dueTime')
      .below(now)
      .and(action => action.status === 'OPEN' || action.status === 'IN_PROGRESS')
      .toArray();
  }
  
  static async getOpenActionCount(assignedTo?: string): Promise<number> {
    let collection = clientDb.actions.where('status').equals('OPEN');
    if (assignedTo) {
      collection = collection.and(action => action.assignedTo === assignedTo);
    }
    return collection.count();
  }
  
  // Asset operations
  static async createAsset(asset: Asset): Promise<string> {
    return clientDb.assets.add(asset);
  }
  
  static async updateAsset(id: string, updates: Partial<Asset>): Promise<void> {
    await clientDb.assets.update(id, updates);
  }
  
  static async getAsset(id: string): Promise<Asset | undefined> {
    return clientDb.assets.get(id);
  }
  
  static async getAssetsByArea(siteId: string, area: string): Promise<Asset[]> {
    return clientDb.assets.where(['siteId', 'area']).equals([siteId, area]).toArray();
  }
  
  static async getDownAssets(siteId: string): Promise<Asset[]> {
    return clientDb.assets.where(['siteId', 'status']).equals([siteId, 'DOWN']).toArray();
  }
  
  // Sync cursor operations
  static async updateSyncCursor(entityType: EntityType, lastOpId: string, lastTimestamp: number): Promise<void> {
    await clientDb.cursors.put({
      entityType,
      lastOpId,
      lastTimestamp
    });
  }
  
  static async getSyncCursor(entityType: EntityType): Promise<SyncCursor | undefined> {
    return clientDb.cursors.where('entityType').equals(entityType).first();
  }
  
  static async getAllSyncCursors(): Promise<SyncCursor[]> {
    return clientDb.cursors.toArray();
  }
  
  // Device info operations
  static async updateDeviceInfo(deviceInfo: DeviceInfo): Promise<void> {
    await clientDb.deviceInfo.put(deviceInfo);
  }
  
  static async getDeviceInfo(deviceId: string): Promise<DeviceInfo | undefined> {
    return clientDb.deviceInfo.where('deviceId').equals(deviceId).first();
  }
  
  // Meta operations
  static async setMeta(key: string, value: unknown): Promise<void> {
    await clientDb.meta.put({ key, value, updatedAt: new Date() });
  }
  
  static async getMeta<T>(key: string): Promise<T | undefined> {
    const meta = await clientDb.meta.where('key').equals(key).first();
    return meta?.value as T;
  }
  
  static async getMetaWithDefault<T>(key: string, defaultValue: T): Promise<T> {
    const value = await this.getMeta<T>(key);
    return value !== undefined ? value : defaultValue;
  }
  
  // Bulk operations for performance
  static async bulkAddOps(ops: LocalOp[]): Promise<void> {
    await clientDb.ops.bulkAdd(ops);
  }
  
  static async bulkUpdateShifts(shifts: Partial<Shift>[]): Promise<void> {
    await clientDb.transaction('rw', clientDb.shifts, async () => {
      for (const shift of shifts) {
        if (shift.id) {
          await clientDb.shifts.update(shift.id, shift);
        }
      }
    });
  }
  
  // Cleanup operations
  static async cleanupOldOps(daysToKeep = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffTs = cutoffDate.getTime();
    
    const deletedCount = await clientDb.ops
      .where('ts')
      .below(cutoffTs)
      .and(op => op.pushed) // Only delete pushed ops
      .delete();
    
    return deletedCount;
  }
  
  static async clearAllData(): Promise<void> {
    await clientDb.transaction('rw', [
      clientDb.ops,
      clientDb.shifts, 
      clientDb.actions,
      clientDb.assets,
      clientDb.cursors,
      clientDb.deviceInfo,
      clientDb.meta
    ], async () => {
      await Promise.all([
        clientDb.ops.clear(),
        clientDb.shifts.clear(),
        clientDb.actions.clear(),
        clientDb.assets.clear(),
        clientDb.cursors.clear(),
        clientDb.deviceInfo.clear(),
        clientDb.meta.clear()
      ]);
    });
  }
  
  // Statistics and monitoring
  static async getStorageStats(): Promise<{
    totalOps: number;
    unpushedOps: number;
    totalShifts: number;
    totalActions: number;
    totalAssets: number;
    dbSizeEstimate: string;
  }> {
    const [totalOps, unpushedOps, totalShifts, totalActions, totalAssets] = await Promise.all([
      clientDb.ops.count(),
      clientDb.ops.where('pushed').equals(0).count(),
      clientDb.shifts.count(),
      clientDb.actions.count(),
      clientDb.assets.count()
    ]);
    
    // Rough estimate of database size
    const estimatedSize = (totalOps * 500) + (totalShifts * 5000) + (totalActions * 1000) + (totalAssets * 2000);
    const sizeInMB = (estimatedSize / 1024 / 1024).toFixed(2);
    
    return {
      totalOps,
      unpushedOps,
      totalShifts,
      totalActions,
      totalAssets,
      dbSizeEstimate: `${sizeInMB} MB`
    };
  }
}

// Initialize database
export async function initializeClientDb(): Promise<void> {
  try {
    await clientDb.open();
    console.log('Client database initialized successfully');
    
    // Set up default device info if not exists
    const deviceId = await ClientDBManager.getMetaWithDefault('deviceId', generateDeviceId());
    await ClientDBManager.setMeta('deviceId', deviceId);
    
    // Initialize sync cursors if not exists
    const entityTypes: EntityType[] = ['shift', 'action', 'asset', 'entry'];
    for (const entityType of entityTypes) {
      const cursor = await ClientDBManager.getSyncCursor(entityType);
      if (!cursor) {
        await ClientDBManager.updateSyncCursor(entityType, '', 0);
      }
    }
    
  } catch (error) {
    console.error('Failed to initialize client database:', error);
    throw error;
  }
}

// Generate a unique device ID
function generateDeviceId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 9);
  return `device_${timestamp}_${randomPart}`;
}

// Export the initialized database
export default clientDb;