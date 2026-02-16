import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { shiftData } = await req.json();

    // MVP: Rule-based summary from structured data
    const sections = shiftData || {};
    const safety = sections.safety || {};
    const production = sections.production || {};
    const equipment = sections.equipment || {};
    const issues = sections.issues || {};

    const briefParts: string[] = [];
    const topRisks: string[] = [];
    const watchList: string[] = [];
    const citations: { id: string; section: string; field: string; value: string }[] = [];

    // Safety
    const incidents = parseInt(safety.incidents) || 0;
    if (incidents > 0) {
      topRisks.push(`${incidents} incident(s) reported this shift`);
      citations.push({ id: 'c1', section: 'safety', field: 'incidents', value: String(incidents) });
    }
    const nearMisses = parseInt(safety.nearMisses) || 0;
    if (nearMisses > 0) {
      watchList.push(`${nearMisses} near miss(es) recorded`);
    }
    briefParts.push(incidents === 0 ? 'No safety incidents.' : `${incidents} safety incident(s) reported.`);

    // Production
    const mined = parseInt(production.tonnesMined) || 0;
    const target = parseInt(production.tonnesTarget) || 0;
    if (mined > 0) {
      const pct = target > 0 ? Math.round((mined / target) * 100) : 0;
      briefParts.push(`Production: ${mined.toLocaleString()}t mined${target > 0 ? ` (${pct}% of target)` : ''}.`);
      citations.push({ id: 'c2', section: 'production', field: 'tonnesMined', value: String(mined) });
      if (pct < 90 && target > 0) topRisks.push(`Production below target at ${pct}%`);
    }

    // Equipment
    const trucksDown = parseInt(equipment.trucksDown) || 0;
    if (trucksDown > 0) {
      watchList.push(`${trucksDown} truck(s) currently down`);
      citations.push({ id: 'c3', section: 'equipment', field: 'trucksDown', value: String(trucksDown) });
    }

    // Issues
    if (issues.handoverNotes) {
      briefParts.push(`Handover: ${issues.handoverNotes}`);
      citations.push({ id: 'c4', section: 'issues', field: 'handoverNotes', value: issues.handoverNotes });
    }

    return NextResponse.json({
      summary: {
        handoverBrief: briefParts.join(' ') || 'Shift completed with no notable issues.',
        topRisks,
        watchList,
        citations,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Summary generation failed' }, { status: 500 });
  }
}
