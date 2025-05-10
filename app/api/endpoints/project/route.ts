import { NextRequest, NextResponse } from 'next/server';// adjust to your db instance path
import { eq, and, sql } from 'drizzle-orm';
import { endpoints } from '@/db/schema';
import { db } from '@/db';
import { auth } from '@/lib/auth';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get('id');
  const take = parseInt(searchParams.get('take') || '10');
  const page = parseInt(searchParams.get('page') || '0');
  const q = searchParams.get('q');
  const filter = searchParams.get('filter');
  const session = await auth()
    
  if (!id) {
    return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
  }

  try {
    const conditions = [eq(endpoints.projectId, id),eq(endpoints.userId, session!.user.id)];

    if (q) {
      conditions.push(sql`${endpoints.name} ILIKE ${q + '%'}`);
    }

    if (filter) {
      conditions.push(eq(endpoints.schema, filter));
    }

    const result = await db.query.endpoints.findMany({
      where: and(...conditions),
      limit: take,
      offset: take * page,
      orderBy: (endpoints) => [endpoints.createdAt],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
