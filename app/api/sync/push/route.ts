import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { ops } = await req.json();
    if (!Array.isArray(ops) || ops.length === 0) {
      return NextResponse.json({ success: false, error: 'No ops provided' }, { status: 400 });
    }

    // TODO: Validate hash chain, store in Postgres via Prisma
    // For MVP, accept all ops
    const acceptedOpIds = ops.map((op: any) => op.opId);

    return NextResponse.json({ success: true, acceptedOpIds });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Push failed' }, { status: 500 });
  }
}
