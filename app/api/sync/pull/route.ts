import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const entityType = req.nextUrl.searchParams.get('entityType');
  const lastOpId = req.nextUrl.searchParams.get('lastOpId');

  // TODO: Query Postgres for ops since lastOpId
  // For MVP, return empty
  return NextResponse.json({ ops: [] });
}
