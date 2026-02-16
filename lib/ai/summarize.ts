import { Shift, Action, Asset } from '../model/types';

// AI-powered shift summarization and analysis
export interface ShiftSummary {
  overview: string;
  safetyHighlights: string[];
  productionSummary: string;
  equipmentStatus: string;
  keyIssues: string[];
  recommendations: string[];
  completeness: number; // 0-100%
  confidence: number; // 0-1.0
}

export interface SummaryOptions {
  includeDetails?: boolean;
  focusAreas?: ('safety' | 'production' | 'equipment' | 'issues')[];
  maxLength?: 'brief' | 'standard' | 'detailed';
  audience?: 'operator' | 'supervisor' | 'manager' | 'executive';
}

export class ShiftSummarizer {
  
  // Generate AI summary of a shift
  static async generateSummary(
    shift: Shift,
    options: SummaryOptions = {}
  ): Promise<ShiftSummary> {
    const {
      includeDetails = true,
      focusAreas = ['safety', 'production', 'equipment', 'issues'],
      maxLength = 'standard',
      audience = 'supervisor'
    } = options;
    
    // Build comprehensive prompt
    const prompt = this.buildSummaryPrompt(shift, {
      includeDetails,
      focusAreas,
      maxLength,
      audience
    });
    
    try {
      // In a real implementation, this would call OpenAI API
      const aiResponse = await this.callAIService(prompt);
      
      return this.parseSummaryResponse(aiResponse, shift);
      
    } catch (error) {
      console.error('AI summarization failed:', error);
      
      // Fallback to rule-based summary
      return this.generateFallbackSummary(shift, options);
    }
  }
  
  private static buildSummaryPrompt(shift: Shift, options: SummaryOptions): string {
    const sections = [];
    
    sections.push(`# Mining Shift Handover Summary
    
Shift Details:
- Shift ID: ${shift.shiftId}
- Type: ${shift.shiftType}
- Status: ${shift.status}
- Start: ${shift.startTime.toISOString()}
- End: ${shift.endTime?.toISOString() || 'In Progress'}
`);
    
    if (options.focusAreas?.includes('safety')) {
      sections.push(`## Safety Section
Incidents: ${JSON.stringify(shift.safety.incidents, null, 2)}
Hazards: ${JSON.stringify(shift.safety.hazards, null, 2)}
Toolbox Talks: ${JSON.stringify(shift.safety.toolboxTalks, null, 2)}
PPE Issues: ${JSON.stringify(shift.safety.ppeIssues, null, 2)}
Safety Metrics: ${JSON.stringify(shift.safety.safetyMetrics, null, 2)}
`);
    }
    
    if (options.focusAreas?.includes('production')) {
      sections.push(`## Production Section
Tonnes: ${JSON.stringify(shift.production.tonnes, null, 2)}
Equipment: ${JSON.stringify(shift.production.equipment, null, 2)}
ROM Levels: ${JSON.stringify(shift.production.romLevels, null, 2)}
Grade: ${JSON.stringify(shift.production.grade, null, 2)}
Delays: ${JSON.stringify(shift.production.delays, null, 2)}
`);
    }
    
    if (options.focusAreas?.includes('equipment')) {
      sections.push(`## Equipment Section
Assets: ${JSON.stringify(shift.equipment.assets, null, 2)}
Breakdowns: ${JSON.stringify(shift.equipment.breakdowns, null, 2)}
Maintenance: ${JSON.stringify(shift.equipment.maintenance, null, 2)}
Inspections: ${JSON.stringify(shift.equipment.inspections, null, 2)}
`);
    }
    
    if (options.focusAreas?.includes('issues')) {
      sections.push(`## Issues Section
Open Issues: ${JSON.stringify(shift.issues.openIssues, null, 2)}
New Issues: ${JSON.stringify(shift.issues.newIssues, null, 2)}
Escalations: ${JSON.stringify(shift.issues.escalations, null, 2)}
Communications: ${JSON.stringify(shift.issues.communications, null, 2)}
`);
    }
    
    const lengthInstruction = {
      brief: 'Keep the summary brief (2-3 sentences per section).',
      standard: 'Provide a standard summary (1-2 paragraphs per section).',
      detailed: 'Provide detailed analysis with specific metrics and actionable insights.'
    }[options.maxLength!];
    
    const audienceInstruction = {
      operator: 'Write for an operator taking over the shift. Focus on immediate actions and safety.',
      supervisor: 'Write for a supervisor. Include performance metrics and team management insights.',
      manager: 'Write for management. Focus on KPIs, issues requiring attention, and strategic insights.',
      executive: 'Write for executives. Focus on high-level metrics, risks, and business impact.'
    }[options.audience!];
    
    sections.push(`
# Instructions
${lengthInstruction} ${audienceInstruction}

Please provide a JSON response with the following structure:
{
  "overview": "Overall shift summary",
  "safetyHighlights": ["Key safety points"],
  "productionSummary": "Production performance summary",
  "equipmentStatus": "Equipment status summary", 
  "keyIssues": ["Important issues"],
  "recommendations": ["Actionable recommendations"],
  "completeness": 85,
  "confidence": 0.9
}

Focus on:
1. Safety incidents and concerns (highest priority)
2. Production performance vs targets
3. Equipment availability and issues
4. Critical actions for next shift
5. Trends and patterns worth noting
`);
    
    return sections.join('\n');
  }
  
  private static async callAIService(prompt: string): Promise<any> {
    // This would call your AI service (OpenAI, Azure Cognitive Services, etc.)
    const response = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        model: 'gpt-4',
        max_tokens: 1000,
        temperature: 0.3 // Lower temperature for more focused, factual responses
      })
    });
    
    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.response;
  }
  
  private static parseSummaryResponse(aiResponse: string, shift: Shift): ShiftSummary {
    try {
      // Try to parse JSON response
      const parsed = JSON.parse(aiResponse);
      
      return {
        overview: parsed.overview || 'AI summary not available',
        safetyHighlights: parsed.safetyHighlights || [],
        productionSummary: parsed.productionSummary || 'No production summary available',
        equipmentStatus: parsed.equipmentStatus || 'No equipment status available',
        keyIssues: parsed.keyIssues || [],
        recommendations: parsed.recommendations || [],
        completeness: parsed.completeness || 0,
        confidence: parsed.confidence || 0.5
      };
      
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      
      // Fallback: treat as plain text
      return {
        overview: aiResponse || 'Summary generation failed',
        safetyHighlights: [],
        productionSummary: '',
        equipmentStatus: '',
        keyIssues: [],
        recommendations: [],
        completeness: 0,
        confidence: 0.1
      };
    }
  }
  
  private static generateFallbackSummary(shift: Shift, options: SummaryOptions): ShiftSummary {
    // Rule-based fallback summary when AI is unavailable
    
    const safetyHighlights: string[] = [];
    if (shift.safety.incidents.length > 0) {
      safetyHighlights.push(`${shift.safety.incidents.length} safety incidents reported`);
    }
    if (shift.safety.hazards.length > 0) {
      safetyHighlights.push(`${shift.safety.hazards.length} hazards identified`);
    }
    if (shift.safety.safetyMetrics.complianceScore < 95) {
      safetyHighlights.push(`Safety compliance at ${shift.safety.safetyMetrics.complianceScore}%`);
    }
    
    const productionVariance = shift.production.tonnes.variance || 
      ((shift.production.tonnes.mined - shift.production.tonnes.target) / shift.production.tonnes.target * 100);
    
    const productionSummary = `Mined ${shift.production.tonnes.mined} tonnes against target of ${shift.production.tonnes.target} (${productionVariance > 0 ? '+' : ''}${productionVariance.toFixed(1)}%)`;
    
    const downEquipment = [
      ...Array(shift.production.equipment.excavators.down).fill('excavator'),
      ...Array(shift.production.equipment.trucks.down).fill('haul truck')
    ];
    
    const equipmentStatus = downEquipment.length > 0 
      ? `${downEquipment.length} equipment units down: ${downEquipment.join(', ')}`
      : 'All major equipment operational';
    
    const keyIssues = [
      ...shift.issues.newIssues.map(issue => issue.title),
      ...shift.equipment.breakdowns.map(breakdown => `${breakdown.description}`)
    ];
    
    const recommendations = [];
    if (productionVariance < -10) {
      recommendations.push('Review production processes for efficiency improvements');
    }
    if (shift.safety.incidents.length > 0) {
      recommendations.push('Follow up on safety incidents and implement corrective actions');
    }
    if (downEquipment.length > 0) {
      recommendations.push('Prioritize equipment repairs to restore production capacity');
    }
    
    return {
      overview: `${shift.shiftType} shift completed with ${shift.safety.incidents.length} safety incidents and ${productionVariance.toFixed(1)}% production variance`,
      safetyHighlights,
      productionSummary,
      equipmentStatus,
      keyIssues,
      recommendations,
      completeness: this.calculateCompleteness(shift),
      confidence: 0.8 // High confidence in rule-based summary
    };
  }
  
  private static calculateCompleteness(shift: Shift): number {
    let completeness = 0;
    let totalFields = 0;
    
    // Check safety section completeness
    totalFields += 5;
    if (shift.safety.safetyMetrics.complianceScore > 0) completeness += 1;
    if (shift.safety.safetyMetrics.daysWithoutIncident >= 0) completeness += 1;
    if (shift.safety.incidents.length >= 0) completeness += 1; // Even 0 is complete
    if (shift.safety.hazards.length >= 0) completeness += 1;
    if (shift.safety.toolboxTalks.length >= 0) completeness += 1;
    
    // Check production section completeness
    totalFields += 4;
    if (shift.production.tonnes.mined > 0) completeness += 1;
    if (shift.production.tonnes.target > 0) completeness += 1;
    if (shift.production.grade.actual > 0) completeness += 1;
    if (shift.production.romLevels.length > 0) completeness += 1;
    
    // Check equipment section completeness
    totalFields += 3;
    if (shift.equipment.assets.length > 0) completeness += 1;
    if (shift.equipment.breakdowns.length >= 0) completeness += 1;
    if (shift.equipment.maintenance.length >= 0) completeness += 1;
    
    // Check issues section completeness
    totalFields += 2;
    if (shift.issues.openIssues.length >= 0) completeness += 1;
    if (shift.issues.newIssues.length >= 0) completeness += 1;
    
    return Math.round((completeness / totalFields) * 100);
  }
  
  // Generate action summaries
  static async generateActionSummary(actions: Action[]): Promise<string> {
    const openActions = actions.filter(a => a.status === 'OPEN').length;
    const overdueActions = actions.filter(a => 
      a.dueTime && new Date() > a.dueTime && a.status !== 'CLOSED'
    ).length;
    const highPriorityActions = actions.filter(a => 
      a.priority === 'HIGH' || a.priority === 'CRITICAL'
    ).length;
    
    if (actions.length === 0) {
      return 'No actions currently assigned.';
    }
    
    const parts = [];
    parts.push(`${openActions} open actions`);
    
    if (overdueActions > 0) {
      parts.push(`${overdueActions} overdue`);
    }
    
    if (highPriorityActions > 0) {
      parts.push(`${highPriorityActions} high priority`);
    }
    
    return parts.join(', ') + '.';
  }
  
  // Generate equipment summary
  static generateEquipmentSummary(assets: Asset[]): string {
    if (assets.length === 0) {
      return 'No equipment data available.';
    }
    
    const operational = assets.filter(a => a.status === 'OPERATIONAL').length;
    const down = assets.filter(a => a.status === 'DOWN').length;
    const maintenance = assets.filter(a => a.status === 'MAINTENANCE').length;
    
    const availability = ((operational / assets.length) * 100).toFixed(1);
    
    let summary = `${operational}/${assets.length} equipment operational (${availability}% availability)`;
    
    if (down > 0) {
      summary += `, ${down} down`;
    }
    
    if (maintenance > 0) {
      summary += `, ${maintenance} in maintenance`;
    }
    
    return summary + '.';
  }
}