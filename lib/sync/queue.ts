import { ClientDBManager } from '../db/clientDb';
import { syncEngine } from './engine';

// Background sync queue for reliable offline-first synchronization
export class SyncQueue {
  private isRunning: boolean = false;
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries: number = 5;
  private baseRetryDelay: number = 1000; // 1 second
  private maxRetryDelay: number = 30000; // 30 seconds
  private syncInterval: number = 30000; // 30 seconds
  private intervalId: NodeJS.Timeout | null = null;
  
  constructor() {
    this.setupEventListeners();
  }
  
  // Start the background sync queue
  start(): void {
    if (this.isRunning) {
      return;
    }
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.processSyncQueue();
    }, this.syncInterval);
    
    // Also process immediately
    this.processSyncQueue();
    
    console.log('Sync queue started');
  }
  
  // Stop the background sync queue
  stop(): void {
    if (!this.isRunning) {
      return;
    }
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('Sync queue stopped');
  }
  
  // Process the sync queue
  private async processSyncQueue(): Promise<void> {
    if (!navigator.onLine) {
      console.log('Offline - skipping sync queue processing');
      return;
    }
    
    try {
      // Get current sync status
      const syncStatus = await syncEngine.getSyncStatus();
      
      if (syncStatus.syncInProgress) {
        console.log('Sync already in progress - skipping queue processing');
        return;
      }
      
      if (syncStatus.pendingOps === 0) {
        console.log('No pending operations - sync queue idle');
        return;
      }
      
      console.log(`Processing sync queue: ${syncStatus.pendingOps} pending ops`);
      
      // Process sync batches
      await this.processSyncBatches();
      
      // Clean up successful retries
      this.cleanupSuccessfulRetries();
      
    } catch (error) {
      console.error('Sync queue processing failed:', error);
      await this.handleSyncError(error as Error);
    }
  }
  
  private async processSyncBatches(): Promise<void> {
    const unpushedOps = await ClientDBManager.getUnpushedOps();
    
    if (unpushedOps.length === 0) {
      return;
    }
    
    // Group ops by entity type for efficient batching
    const opsByEntity = new Map<string, typeof unpushedOps>();
    
    for (const op of unpushedOps) {
      const key = `${op.entityType}:${op.entityId}`;
      if (!opsByEntity.has(key)) {
        opsByEntity.set(key, []);
      }
      opsByEntity.get(key)!.push(op);
    }
    
    // Process each entity batch
    for (const [entityKey, ops] of opsByEntity) {
      await this.processBatch(entityKey, ops);
    }
  }
  
  private async processBatch(entityKey: string, ops: typeof unpushedOps): Promise<void> {
    const retryCount = this.retryAttempts.get(entityKey) || 0;
    
    if (retryCount >= this.maxRetries) {
      console.warn(`Max retries exceeded for ${entityKey}, skipping batch`);
      await this.handleMaxRetriesExceeded(entityKey, ops);
      return;
    }
    
    try {
      // Trigger sync for this batch
      await syncEngine.forcSync();
      
      // If successful, remove from retry tracking
      this.retryAttempts.delete(entityKey);
      
      console.log(`Successfully synced batch: ${entityKey}`);
      
    } catch (error) {
      console.error(`Batch sync failed for ${entityKey}:`, error);
      
      // Increment retry count
      this.retryAttempts.set(entityKey, retryCount + 1);
      
      // Schedule retry with exponential backoff
      await this.scheduleRetry(entityKey, retryCount + 1);
    }
  }
  
  private async scheduleRetry(entityKey: string, retryCount: number): Promise<void> {
    const delay = Math.min(
      this.baseRetryDelay * Math.pow(2, retryCount - 1),
      this.maxRetryDelay
    );
    
    console.log(`Scheduling retry ${retryCount} for ${entityKey} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.isRunning && navigator.onLine) {
        this.processSyncQueue();
      }
    }, delay);
  }
  
  private async handleMaxRetriesExceeded(entityKey: string, ops: typeof unpushedOps): Promise<void> {
    console.error(`Max retries exceeded for ${entityKey}. Moving ops to failed queue.`);
    
    // Store failed ops for manual inspection
    const failedOps = {
      entityKey,
      ops: ops.map(op => ({
        opId: op.opId,
        entityType: op.entityType,
        entityId: op.entityId,
        kind: op.kind,
        ts: op.ts,
        error: 'Max retries exceeded'
      })),
      timestamp: Date.now(),
      retryCount: this.maxRetries
    };
    
    await ClientDBManager.setMeta(`failed_sync:${entityKey}:${Date.now()}`, failedOps);
    
    // Remove from retry tracking
    this.retryAttempts.delete(entityKey);
    
    // Optionally mark ops as failed (but keep for manual recovery)
    // await ClientDBManager.markOpsFailed(ops.map(op => op.opId));
  }
  
  private async handleSyncError(error: Error): Promise<void> {
    // Store error for diagnostics
    const errorRecord = {
      error: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      syncStatus: await syncEngine.getSyncStatus()
    };
    
    await ClientDBManager.setMeta(`sync_error:${Date.now()}`, errorRecord);
    
    // Notify user if appropriate
    if (this.isRecoverableError(error)) {
      console.log('Recoverable sync error, will retry');
    } else {
      console.error('Non-recoverable sync error:', error);
      // Could show user notification here
    }
  }
  
  private isRecoverableError(error: Error): boolean {
    // Network errors are usually recoverable
    if (error.message.includes('fetch') || 
        error.message.includes('network') ||
        error.message.includes('timeout')) {
      return true;
    }
    
    // Server errors (5xx) are potentially recoverable
    if (error.message.includes('500') ||
        error.message.includes('502') ||
        error.message.includes('503')) {
      return true;
    }
    
    // Client errors (4xx) are usually not recoverable
    return false;
  }
  
  private cleanupSuccessfulRetries(): void {
    // Remove old successful entries
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    
    for (const [key] of this.retryAttempts) {
      // This is a simplified cleanup - in production, would track timestamps
      if (Math.random() < 0.1) { // Probabilistic cleanup
        this.retryAttempts.delete(key);
      }
    }
  }
  
  private setupEventListeners(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('Device came online, triggering sync queue');
      if (this.isRunning) {
        this.processSyncQueue();
      }
    });
    
    window.addEventListener('offline', () => {
      console.log('Device went offline, pausing sync queue');
    });
    
    // Listen for visibility changes (app becomes active)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isRunning && navigator.onLine) {
        console.log('App became active, processing sync queue');
        this.processSyncQueue();
      }
    });
    
    // Listen for focus events (user returned to app)
    window.addEventListener('focus', () => {
      if (this.isRunning && navigator.onLine) {
        console.log('App gained focus, processing sync queue');
        this.processSyncQueue();
      }
    });
  }
  
  // Public methods for manual control
  
  async triggerImmediateSync(): Promise<void> {
    console.log('Immediate sync triggered');
    await this.processSyncQueue();
  }
  
  async getQueueStatus(): Promise<QueueStatus> {
    const syncStatus = await syncEngine.getSyncStatus();
    const failedOps = await this.getFailedOps();
    
    return {
      isRunning: this.isRunning,
      pendingOps: syncStatus.pendingOps,
      retryingOps: Array.from(this.retryAttempts.entries()).map(([key, count]) => ({
        entityKey: key,
        retryCount: count
      })),
      failedOps: failedOps.length,
      lastSync: syncStatus.lastSync,
      conflicts: syncStatus.conflicts
    };
  }
  
  async getFailedOps(): Promise<FailedOp[]> {
    const failed: FailedOp[] = [];
    
    // This would need to be implemented properly with a prefix scan
    // For now, simplified version
    try {
      const meta = await ClientDBManager.getMeta<any>('failed_ops') || [];
      return meta;
    } catch (error) {
      console.error('Failed to get failed ops:', error);
      return [];
    }
  }
  
  async retryFailedOps(entityKey?: string): Promise<void> {
    if (entityKey) {
      // Retry specific entity
      this.retryAttempts.set(entityKey, 0);
      await this.processSyncQueue();
    } else {
      // Retry all failed ops
      this.retryAttempts.clear();
      await this.processSyncQueue();
    }
  }
  
  async clearFailedOps(): Promise<void> {
    // Clear all failed op records
    // This would need proper implementation to clear prefixed keys
    this.retryAttempts.clear();
    console.log('Cleared failed ops');
  }
  
  // Diagnostics and monitoring
  
  async getSyncMetrics(): Promise<SyncMetrics> {
    const storageStats = await ClientDBManager.getStorageStats();
    const queueStatus = await this.getQueueStatus();
    
    return {
      totalOps: storageStats.totalOps,
      pushedOps: storageStats.totalOps - storageStats.unpushedOps,
      pendingOps: storageStats.unpushedOps,
      failedOps: queueStatus.failedOps,
      conflicts: queueStatus.conflicts,
      dbSize: storageStats.dbSizeEstimate,
      isOnline: navigator.onLine,
      queueRunning: this.isRunning,
      retryingEntities: queueStatus.retryingOps.length
    };
  }
  
  async exportDiagnosticData(): Promise<DiagnosticData> {
    const metrics = await this.getSyncMetrics();
    const queueStatus = await this.getQueueStatus();
    const failedOps = await this.getFailedOps();
    
    return {
      timestamp: new Date(),
      metrics,
      queueStatus,
      failedOps,
      retryAttempts: Object.fromEntries(this.retryAttempts),
      deviceInfo: {
        userAgent: navigator.userAgent,
        online: navigator.onLine,
        language: navigator.language,
        platform: navigator.platform
      }
    };
  }
}

// Types
export interface QueueStatus {
  isRunning: boolean;
  pendingOps: number;
  retryingOps: { entityKey: string; retryCount: number }[];
  failedOps: number;
  lastSync: Date | null;
  conflicts: number;
}

export interface FailedOp {
  entityKey: string;
  ops: any[];
  timestamp: number;
  retryCount: number;
}

export interface SyncMetrics {
  totalOps: number;
  pushedOps: number;
  pendingOps: number;
  failedOps: number;
  conflicts: number;
  dbSize: string;
  isOnline: boolean;
  queueRunning: boolean;
  retryingEntities: number;
}

export interface DiagnosticData {
  timestamp: Date;
  metrics: SyncMetrics;
  queueStatus: QueueStatus;
  failedOps: FailedOp[];
  retryAttempts: Record<string, number>;
  deviceInfo: {
    userAgent: string;
    online: boolean;
    language: string;
    platform: string;
  };
}

// Export singleton instance
export const syncQueue = new SyncQueue();