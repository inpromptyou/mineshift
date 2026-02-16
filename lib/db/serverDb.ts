import { PrismaClient } from '@prisma/client';
import { Op, Shift, Action, Asset, User, Site } from '../model/types';

// Global Prisma client instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Create Prisma client with optimizations
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
  });
};

// Singleton pattern for Prisma client
export const serverDb = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = serverDb;
}

// Server database manager with high-level operations
export class ServerDBManager {
  
  // Op-log operations
  static async storeOps(ops: Op[]): Promise<void> {
    await serverDb.op.createMany({
      data: ops.map(op => ({
        opId: op.opId,
        deviceId: op.deviceId,
        actorId: op.actorId,
        ts: BigInt(op.ts),
        lamport: op.lamport,
        entityType: op.entityType,
        entityId: op.entityId,
        kind: op.kind,
        path: op.path,
        value: op.value as any,
        prevHash: op.prevHash,
        hash: op.hash,
        siteId: '', // Will be populated from actor's site
        receivedAt: new Date()
      }))
    });
  }
  
  static async getOpsSince(siteId: string, entityType: string, cursor: { lastOpId?: string, lastTimestamp?: number }): Promise<Op[]> {
    const where: any = {
      siteId,
      entityType
    };
    
    // Add cursor conditions for pagination
    if (cursor.lastTimestamp) {
      where.receivedAt = {
        gt: new Date(cursor.lastTimestamp)
      };
    }
    
    const ops = await serverDb.op.findMany({
      where,
      orderBy: {
        receivedAt: 'asc'
      },
      take: 1000 // Limit batch size
    });
    
    return ops.map((op: any) => ({
      opId: op.opId,
      deviceId: op.deviceId,
      actorId: op.actorId,
      ts: Number(op.ts),
      lamport: op.lamport,
      entityType: op.entityType as any,
      entityId: op.entityId,
      kind: op.kind as any,
      path: op.path || undefined,
      value: op.value,
      prevHash: op.prevHash || undefined,
      hash: op.hash
    }));
  }
  
  // User operations
  static async getUser(id: string): Promise<User | null> {
    const user = await serverDb.user.findUnique({
      where: { id },
      include: { site: true }
    });
    
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      siteId: user.siteId
    };
  }
  
  static async getUserByEmail(email: string): Promise<User | null> {
    const user = await serverDb.user.findUnique({
      where: { email },
      include: { site: true }
    });
    
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      siteId: user.siteId
    };
  }
  
  static async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const user = await serverDb.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        siteId: userData.siteId
      }
    });
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      siteId: user.siteId
    };
  }
  
  // Site operations
  static async getSite(id: string): Promise<Site | null> {
    const site = await serverDb.site.findUnique({
      where: { id }
    });
    
    if (!site) return null;
    
    return {
      id: site.id,
      name: site.name,
      region: site.region,
      timezone: site.timezone
    };
  }
  
  static async getSitesByRegion(region: string): Promise<Site[]> {
    const sites = await serverDb.site.findMany({
      where: { region }
    });
    
    return sites.map(site => ({
      id: site.id,
      name: site.name,
      region: site.region,
      timezone: site.timezone
    }));
  }
  
  // Materialized view operations - these rebuild from ops
  static async rebuildShift(shiftId: string): Promise<Shift | null> {
    // Get all ops for this shift
    const ops = await serverDb.op.findMany({
      where: {
        entityType: 'shift',
        entityId: shiftId
      },
      orderBy: [
        { lamport: 'asc' },
        { ts: 'asc' }
      ]
    });
    
    if (ops.length === 0) return null;
    
    // Apply ops to rebuild current state
    let shift = await this.applyOpsToShift(ops);
    
    // Store/update materialized view
    await serverDb.shift.upsert({
      where: { shiftId },
      create: {
        id: shift.id,
        shiftId: shift.shiftId,
        siteId: shift.siteId,
        shiftType: shift.shiftType,
        startTime: shift.startTime,
        endTime: shift.endTime,
        status: shift.status,
        safety: shift.safety as any,
        production: shift.production as any,
        equipment: shift.equipment as any,
        issues: shift.issues as any,
        createdBy: shift.createdBy,
        version: shift.version
      },
      update: {
        status: shift.status,
        endTime: shift.endTime,
        safety: shift.safety as any,
        production: shift.production as any,
        equipment: shift.equipment as any,
        issues: shift.issues as any,
        version: shift.version,
        lastSyncAt: new Date()
      }
    });
    
    return shift;
  }
  
  static async getShift(shiftId: string): Promise<Shift | null> {
    const shift = await serverDb.shift.findUnique({
      where: { shiftId }
    });
    
    if (!shift) return null;
    
    return {
      id: shift.id,
      shiftId: shift.shiftId,
      siteId: shift.siteId,
      shiftType: shift.shiftType as any,
      startTime: shift.startTime,
      endTime: shift.endTime,
      status: shift.status as any,
      safety: shift.safety as any,
      production: shift.production as any,
      equipment: shift.equipment as any,
      issues: shift.issues as any,
      createdBy: shift.createdBy,
      createdAt: shift.createdAt,
      lastSyncAt: shift.lastSyncAt,
      version: shift.version
    };
  }
  
  static async getShiftsBySite(siteId: string, limit = 50): Promise<Shift[]> {
    const shifts = await serverDb.shift.findMany({
      where: { siteId },
      orderBy: { startTime: 'desc' },
      take: limit
    });
    
    return shifts.map(shift => ({
      id: shift.id,
      shiftId: shift.shiftId,
      siteId: shift.siteId,
      shiftType: shift.shiftType as any,
      startTime: shift.startTime,
      endTime: shift.endTime,
      status: shift.status as any,
      safety: shift.safety as any,
      production: shift.production as any,
      equipment: shift.equipment as any,
      issues: shift.issues as any,
      createdBy: shift.createdBy,
      createdAt: shift.createdAt,
      lastSyncAt: shift.lastSyncAt,
      version: shift.version
    }));
  }
  
  // Action operations
  static async rebuildAction(actionId: string): Promise<Action | null> {
    const ops = await serverDb.op.findMany({
      where: {
        entityType: 'action',
        entityId: actionId
      },
      orderBy: [
        { lamport: 'asc' },
        { ts: 'asc' }
      ]
    });
    
    if (ops.length === 0) return null;
    
    let action = await this.applyOpsToAction(ops);
    
    // Store/update materialized view
    await serverDb.action.upsert({
      where: { id: actionId },
      create: {
        id: action.id,
        shiftId: action.shiftId,
        title: action.title,
        description: action.description,
        priority: action.priority,
        status: action.status,
        dueTime: action.dueTime,
        category: action.category,
        assignedTo: action.assignedTo,
        assignedBy: action.assignedBy,
        evidence: action.evidence as any,
        completedAt: action.completedAt
      },
      update: {
        title: action.title,
        description: action.description,
        priority: action.priority,
        status: action.status,
        dueTime: action.dueTime,
        category: action.category,
        assignedTo: action.assignedTo,
        evidence: action.evidence as any,
        completedAt: action.completedAt,
        updatedAt: new Date()
      }
    });
    
    return action;
  }
  
  static async getAction(id: string): Promise<Action | null> {
    const action = await serverDb.action.findUnique({
      where: { id }
    });
    
    if (!action) return null;
    
    return {
      id: action.id,
      shiftId: action.shiftId,
      title: action.title,
      description: action.description,
      priority: action.priority as any,
      status: action.status as any,
      dueTime: action.dueTime,
      category: action.category,
      assignedTo: action.assignedTo,
      assignedBy: action.assignedBy,
      evidence: action.evidence as any,
      createdAt: action.createdAt,
      updatedAt: action.updatedAt,
      completedAt: action.completedAt
    };
  }
  
  static async getActionsByAssignee(assignedTo: string): Promise<Action[]> {
    const actions = await serverDb.action.findMany({
      where: { assignedTo },
      orderBy: { dueTime: 'asc' }
    });
    
    return actions.map(action => ({
      id: action.id,
      shiftId: action.shiftId,
      title: action.title,
      description: action.description,
      priority: action.priority as any,
      status: action.status as any,
      dueTime: action.dueTime,
      category: action.category,
      assignedTo: action.assignedTo,
      assignedBy: action.assignedBy,
      evidence: action.evidence as any,
      createdAt: action.createdAt,
      updatedAt: action.updatedAt,
      completedAt: action.completedAt
    }));
  }
  
  // Asset operations
  static async getAsset(id: string): Promise<Asset | null> {
    const asset = await serverDb.asset.findUnique({
      where: { id }
    });
    
    if (!asset) return null;
    
    return {
      id: asset.id,
      name: asset.name,
      area: asset.area,
      assetType: asset.assetType as any,
      status: asset.status as any,
      siteId: asset.siteId,
      model: asset.model,
      serialNo: asset.serialNo,
      lastMaint: asset.lastMaint,
      nextMaint: asset.nextMaint,
      metrics: asset.metrics as any,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt
    };
  }
  
  static async getAssetsBySite(siteId: string): Promise<Asset[]> {
    const assets = await serverDb.asset.findMany({
      where: { siteId },
      orderBy: { name: 'asc' }
    });
    
    return assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      area: asset.area,
      assetType: asset.assetType as any,
      status: asset.status as any,
      siteId: asset.siteId,
      model: asset.model,
      serialNo: asset.serialNo,
      lastMaint: asset.lastMaint,
      nextMaint: asset.nextMaint,
      metrics: asset.metrics as any,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt
    }));
  }
  
  // Health check and statistics
  static async getHealthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    opsCount: number;
    lastOpTime: Date | null;
    shiftsCount: number;
    actionsCount: number;
    assetsCount: number;
  }> {
    try {
      const [opsCount, shiftsCount, actionsCount, assetsCount, lastOp] = await Promise.all([
        serverDb.op.count(),
        serverDb.shift.count(), 
        serverDb.action.count(),
        serverDb.asset.count(),
        serverDb.op.findFirst({
          orderBy: { receivedAt: 'desc' },
          select: { receivedAt: true }
        })
      ]);
      
      return {
        status: 'healthy',
        opsCount,
        lastOpTime: lastOp?.receivedAt || null,
        shiftsCount,
        actionsCount,
        assetsCount
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        opsCount: 0,
        lastOpTime: null,
        shiftsCount: 0,
        actionsCount: 0,
        assetsCount: 0
      };
    }
  }
  
  // Private helper methods
  private static async applyOpsToShift(ops: any[]): Promise<Shift> {
    // This would contain the complex logic to replay ops and build current shift state
    // For now, simplified version
    const firstOp = ops[0];
    
    return {
      id: firstOp.entityId,
      shiftId: firstOp.entityId,
      siteId: firstOp.siteId,
      shiftType: 'DAY' as any,
      startTime: new Date(Number(firstOp.ts)),
      status: 'OPEN' as any,
      safety: { incidents: [], hazards: [], toolboxTalks: [], ppeIssues: [], safetyMetrics: { daysWithoutIncident: 0, totalIncidents: 0, nearMisses: 0, complianceScore: 100 } },
      production: { tonnes: { mined: 0, hauled: 0, processed: 0, target: 0, variance: 0 }, equipment: { excavators: { available: 0, operational: 0, down: 0 }, trucks: { available: 0, operational: 0, down: 0 }, support: { available: 0, operational: 0, down: 0 } }, romLevels: [], grade: { target: 0, actual: 0, variance: 0, samples: 0 }, delays: [] },
      equipment: { assets: [], breakdowns: [], maintenance: [], inspections: [] },
      issues: { openIssues: [], newIssues: [], escalations: [], communications: [] },
      createdBy: firstOp.actorId,
      createdAt: new Date(Number(firstOp.ts)),
      lastSyncAt: new Date(),
      version: ops.length
    };
  }
  
  private static async applyOpsToAction(ops: any[]): Promise<Action> {
    // Similar op replay logic for actions
    const firstOp = ops[0];
    
    return {
      id: firstOp.entityId,
      title: 'Action from ops',
      priority: 'MEDIUM' as any,
      status: 'OPEN' as any,
      assignedTo: firstOp.actorId,
      assignedBy: firstOp.actorId,
      createdAt: new Date(Number(firstOp.ts)),
      updatedAt: new Date()
    };
  }
}

export default serverDb;