import { Shift, Action } from '../model/types';
import { STANDARD_MINING_TEMPLATE, validateShift } from '../model/templates';

// AI-powered missing field detection and completion suggestions
export interface MissingField {
  fieldPath: string;
  fieldLabel: string;
  section: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  suggestedValue?: unknown;
  confidence?: number; // 0-1.0
}

export interface CompletionAnalysis {
  overallCompleteness: number; // 0-100%
  missingFields: MissingField[];
  suggestions: CompletionSuggestion[];
  warnings: FieldWarning[];
  estimatedTimeToComplete: number; // minutes
}

export interface CompletionSuggestion {
  type: 'auto-fill' | 'template' | 'calculation' | 'reminder';
  message: string;
  actions: SuggestionAction[];
  priority: number; // 1-10, higher = more important
}

export interface SuggestionAction {
  type: 'fill-field' | 'show-template' | 'calculate' | 'notify';
  fieldPath?: string;
  value?: unknown;
  template?: string;
}

export interface FieldWarning {
  fieldPath: string;
  type: 'inconsistent' | 'unusual' | 'overdue' | 'invalid';
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export class MissingFieldDetector {
  
  // Analyze shift completeness and detect missing fields
  static async analyzeShiftCompleteness(
    shift: Partial<Shift>,
    previousShift?: Shift
  ): Promise<CompletionAnalysis> {
    
    const missingFields = this.detectMissingFields(shift);
    const warnings = this.detectFieldWarnings(shift, previousShift);
    const suggestions = await this.generateCompletionSuggestions(shift, missingFields, previousShift);
    
    const completeness = this.calculateCompleteness(shift, missingFields);
    const estimatedTime = this.estimateCompletionTime(missingFields);
    
    return {
      overallCompleteness: completeness,
      missingFields,
      suggestions,
      warnings,
      estimatedTimeToComplete: estimatedTime
    };
  }
  
  private static detectMissingFields(shift: Partial<Shift>): MissingField[] {
    const missing: MissingField[] = [];
    
    // Use template validation to find missing required fields
    const validationErrors = validateShift(shift);
    
    for (const error of validationErrors) {
      const fieldPath = error.replace('Required field missing: ', '');
      const field = this.getFieldInfo(fieldPath);
      
      missing.push({
        fieldPath,
        fieldLabel: field.label,
        section: field.section,
        importance: field.importance,
        reason: `Required field for ${field.section} section`
      });
    }
    
    // Detect contextually missing fields (not strictly required but important)
    const contextualMissing = this.detectContextualMissingFields(shift);
    missing.push(...contextualMissing);
    
    return missing;
  }
  
  private static detectContextualMissingFields(shift: Partial<Shift>): MissingField[] {
    const missing: MissingField[] = [];
    
    // If there are incidents but no hazards identified, flag as missing
    if (shift.safety?.incidents && shift.safety.incidents.length > 0) {
      if (!shift.safety.hazards || shift.safety.hazards.length === 0) {
        missing.push({
          fieldPath: 'safety.hazards',
          fieldLabel: 'Identified Hazards',
          section: 'Safety',
          importance: 'high',
          reason: 'Safety incidents reported but no hazards identified'
        });
      }
    }
    
    // If production is below target but no delays recorded
    if (shift.production?.tonnes) {
      const variance = shift.production.tonnes.mined - shift.production.tonnes.target;
      if (variance < -500 && (!shift.production.delays || shift.production.delays.length === 0)) {
        missing.push({
          fieldPath: 'production.delays',
          fieldLabel: 'Production Delays',
          section: 'Production',
          importance: 'high',
          reason: 'Production significantly below target but no delays recorded'
        });
      }
    }
    
    // If equipment is down but no breakdowns recorded
    if (shift.production?.equipment) {
      const totalDown = (shift.production.equipment.excavators?.down || 0) +
                       (shift.production.equipment.trucks?.down || 0);
      
      if (totalDown > 0 && (!shift.equipment?.breakdowns || shift.equipment.breakdowns.length === 0)) {
        missing.push({
          fieldPath: 'equipment.breakdowns',
          fieldLabel: 'Equipment Breakdowns',
          section: 'Equipment',
          importance: 'high',
          reason: 'Equipment reported as down but no breakdowns documented'
        });
      }
    }
    
    // If new issues but no escalations when high priority
    if (shift.issues?.newIssues) {
      const criticalIssues = shift.issues.newIssues.filter(issue => 
        issue.priority === 'CRITICAL' || issue.priority === 'HIGH'
      );
      
      if (criticalIssues.length > 0 && (!shift.issues.escalations || shift.issues.escalations.length === 0)) {
        missing.push({
          fieldPath: 'issues.escalations',
          fieldLabel: 'Escalations',
          section: 'Issues',
          importance: 'medium',
          reason: 'High priority issues identified but no escalations recorded'
        });
      }
    }
    
    // ROM levels should be updated if production occurred
    if (shift.production?.tonnes?.processed && shift.production.tonnes.processed > 0) {
      if (!shift.production.romLevels || shift.production.romLevels.length === 0) {
        missing.push({
          fieldPath: 'production.romLevels',
          fieldLabel: 'ROM Stockpile Levels',
          section: 'Production',
          importance: 'medium',
          reason: 'Material processed but ROM levels not updated'
        });
      }
    }
    
    return missing;
  }
  
  private static detectFieldWarnings(shift: Partial<Shift>, previousShift?: Shift): FieldWarning[] {
    const warnings: FieldWarning[] = [];
    
    // Check for unusual values
    if (shift.production?.tonnes) {
      // Unusually high production
      if (shift.production.tonnes.mined > 15000) {
        warnings.push({
          fieldPath: 'production.tonnes.mined',
          type: 'unusual',
          message: 'Unusually high production figures - please verify',
          severity: 'warning'
        });
      }
      
      // Negative production
      if (shift.production.tonnes.mined < 0) {
        warnings.push({
          fieldPath: 'production.tonnes.mined',
          type: 'invalid',
          message: 'Production cannot be negative',
          severity: 'error'
        });
      }
    }
    
    // Check for inconsistencies
    if (shift.production?.tonnes) {
      const { mined, hauled, processed } = shift.production.tonnes;
      
      // Hauled more than mined
      if (hauled > mined + 500) { // Allow some tolerance for stockpile
        warnings.push({
          fieldPath: 'production.tonnes.hauled',
          type: 'inconsistent',
          message: 'Tonnes hauled exceeds tonnes mined significantly',
          severity: 'warning'
        });
      }
      
      // Processed more than hauled
      if (processed > hauled + 200) {
        warnings.push({
          fieldPath: 'production.tonnes.processed',
          type: 'inconsistent', 
          message: 'Tonnes processed exceeds tonnes hauled',
          severity: 'warning'
        });
      }
    }
    
    // Check against previous shift for trends
    if (previousShift) {
      const prevSafety = previousShift.safety.safetyMetrics.complianceScore;
      const currSafety = shift.safety?.safetyMetrics?.complianceScore;
      
      if (currSafety && currSafety < prevSafety - 10) {
        warnings.push({
          fieldPath: 'safety.safetyMetrics.complianceScore',
          type: 'unusual',
          message: 'Safety compliance score dropped significantly from previous shift',
          severity: 'warning'
        });
      }
    }
    
    return warnings;
  }
  
  private static async generateCompletionSuggestions(
    shift: Partial<Shift>,
    missingFields: MissingField[],
    previousShift?: Shift
  ): Promise<CompletionSuggestion[]> {
    const suggestions: CompletionSuggestion[] = [];
    
    // Auto-fill suggestions based on previous shift
    if (previousShift) {
      suggestions.push({
        type: 'auto-fill',
        message: 'Copy non-changing values from previous shift',
        priority: 8,
        actions: [
          {
            type: 'fill-field',
            fieldPath: 'production.tonnes.target',
            value: previousShift.production.tonnes.target
          },
          {
            type: 'fill-field',
            fieldPath: 'production.grade.target', 
            value: previousShift.production.grade.target
          }
        ]
      });
    }
    
    // Template suggestions for empty sections
    const emptySections = this.findEmptySections(shift);
    for (const section of emptySections) {
      suggestions.push({
        type: 'template',
        message: `Use template to quickly fill ${section} section`,
        priority: 6,
        actions: [{
          type: 'show-template',
          template: section
        }]
      });
    }
    
    // Calculation suggestions
    if (shift.production?.tonnes?.mined && shift.production?.tonnes?.target) {
      suggestions.push({
        type: 'calculation',
        message: 'Auto-calculate production variance',
        priority: 7,
        actions: [{
          type: 'calculate',
          fieldPath: 'production.tonnes.variance'
        }]
      });
    }
    
    // Critical field reminders
    const criticalMissing = missingFields.filter(f => f.importance === 'critical');
    if (criticalMissing.length > 0) {
      suggestions.push({
        type: 'reminder',
        message: `Complete ${criticalMissing.length} critical fields before closing shift`,
        priority: 10,
        actions: criticalMissing.map(field => ({
          type: 'notify',
          fieldPath: field.fieldPath
        }))
      });
    }
    
    // AI-powered suggestions (would call AI service in real implementation)
    if (missingFields.length > 0) {
      const aiSuggestions = await this.generateAISuggestions(shift, missingFields);
      suggestions.push(...aiSuggestions);
    }
    
    return suggestions.sort((a, b) => b.priority - a.priority);
  }
  
  private static async generateAISuggestions(
    shift: Partial<Shift>,
    missingFields: MissingField[]
  ): Promise<CompletionSuggestion[]> {
    // This would call an AI service to analyze the shift and suggest completions
    // For now, return rule-based suggestions
    
    const suggestions: CompletionSuggestion[] = [];
    
    // Suggest values based on patterns
    const productionMissing = missingFields.find(f => f.fieldPath.startsWith('production.'));
    if (productionMissing && shift.shiftType) {
      const typicalTargets = {
        'DAY': 12000,
        'NIGHT': 8000,
        'SWING': 10000
      };
      
      suggestions.push({
        type: 'auto-fill',
        message: `Suggest typical ${shift.shiftType} shift targets`,
        priority: 5,
        actions: [{
          type: 'fill-field',
          fieldPath: 'production.tonnes.target',
          value: typicalTargets[shift.shiftType as keyof typeof typicalTargets]
        }]
      });
    }
    
    return suggestions;
  }
  
  private static calculateCompleteness(shift: Partial<Shift>, missingFields: MissingField[]): number {
    // Calculate weighted completeness based on field importance
    const totalFields = this.getTotalRequiredFields();
    const missingWeight = missingFields.reduce((sum, field) => {
      const weights = { critical: 4, high: 3, medium: 2, low: 1 };
      return sum + weights[field.importance];
    }, 0);
    
    const maxWeight = totalFields * 2; // Assume average importance is 'medium'
    const completeness = Math.max(0, (maxWeight - missingWeight) / maxWeight * 100);
    
    return Math.round(completeness);
  }
  
  private static estimateCompletionTime(missingFields: MissingField[]): number {
    // Estimate time to complete missing fields in minutes
    const timeEstimates = {
      critical: 5, // Safety fields take more time
      high: 3,
      medium: 2,
      low: 1
    };
    
    return missingFields.reduce((total, field) => {
      return total + timeEstimates[field.importance];
    }, 0);
  }
  
  private static getFieldInfo(fieldPath: string): {
    label: string;
    section: string;
    importance: 'critical' | 'high' | 'medium' | 'low';
  } {
    // Map field paths to user-friendly info
    const fieldMapping: Record<string, any> = {
      'safety.safetyMetrics.complianceScore': {
        label: 'Safety Compliance Score',
        section: 'Safety',
        importance: 'critical'
      },
      'production.tonnes.mined': {
        label: 'Tonnes Mined',
        section: 'Production', 
        importance: 'high'
      },
      'production.tonnes.target': {
        label: 'Target Tonnes',
        section: 'Production',
        importance: 'high'
      },
      'equipment.assets': {
        label: 'Equipment Status',
        section: 'Equipment',
        importance: 'medium'
      }
    };
    
    return fieldMapping[fieldPath] || {
      label: fieldPath,
      section: 'Unknown',
      importance: 'medium'
    };
  }
  
  private static findEmptySections(shift: Partial<Shift>): string[] {
    const empty: string[] = [];
    
    if (!shift.safety || Object.keys(shift.safety).length === 0) {
      empty.push('Safety');
    }
    
    if (!shift.production || Object.keys(shift.production).length === 0) {
      empty.push('Production');
    }
    
    if (!shift.equipment || Object.keys(shift.equipment).length === 0) {
      empty.push('Equipment');
    }
    
    if (!shift.issues || Object.keys(shift.issues).length === 0) {
      empty.push('Issues');
    }
    
    return empty;
  }
  
  private static getTotalRequiredFields(): number {
    // Return total number of fields in template
    return STANDARD_MINING_TEMPLATE.requiredFields.length;
  }
  
  // Public API methods
  
  static async getFieldSuggestions(
    fieldPath: string,
    currentValue: unknown,
    shift: Partial<Shift>
  ): Promise<unknown[]> {
    // Get AI-powered suggestions for a specific field
    // This would call an AI service in real implementation
    
    const suggestions: unknown[] = [];
    
    // Rule-based suggestions for now
    if (fieldPath === 'production.tonnes.target') {
      suggestions.push(10000, 12000, 8000);
    } else if (fieldPath === 'safety.safetyMetrics.complianceScore') {
      suggestions.push(100, 95, 90);
    }
    
    return suggestions;
  }
  
  static validateFieldValue(
    fieldPath: string,
    value: unknown,
    shift: Partial<Shift>
  ): { valid: boolean; warning?: string; suggestion?: unknown } {
    // Validate and suggest corrections for field values
    
    if (fieldPath === 'production.tonnes.mined' && typeof value === 'number') {
      if (value < 0) {
        return { 
          valid: false, 
          warning: 'Production cannot be negative',
          suggestion: 0 
        };
      }
      if (value > 20000) {
        return { 
          valid: true, 
          warning: 'Unusually high production - please verify' 
        };
      }
    }
    
    if (fieldPath === 'safety.safetyMetrics.complianceScore' && typeof value === 'number') {
      if (value < 0 || value > 100) {
        return { 
          valid: false, 
          warning: 'Compliance score must be between 0-100%',
          suggestion: Math.max(0, Math.min(100, value))
        };
      }
      if (value < 80) {
        return { 
          valid: true, 
          warning: 'Low compliance score requires explanation' 
        };
      }
    }
    
    return { valid: true };
  }
}