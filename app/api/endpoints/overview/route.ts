// app/api/usage/monthly/route.ts
import { db } from '@/db';
import { auth } from '@/lib/auth';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await db.execute(
      sql`
        SELECT 
          TO_CHAR("createdAt", 'Mon') AS month,
          EXTRACT(MONTH FROM "createdAt") AS month_number,
          COUNT(*) FILTER (WHERE source = 'user') AS user_count,
          COUNT(*) FILTER (WHERE source = 'event') AS event_count,
          COUNT(*) FILTER (WHERE source = 'payment') AS payment_count,
          COUNT(*) FILTER (WHERE source = 'subscription') AS subscription_count
        FROM (
          SELECT "createdAt", "authorId", 'user' AS source FROM "userSchema"
          UNION ALL
          SELECT "createdAt", "authorId", 'event' AS source FROM "eventSchema"
          UNION ALL
          SELECT "createdAt", "authorId", 'payment' AS source FROM "paymentSchema"
          UNION ALL
          SELECT "createdAt", "authorId", 'subscription' AS source FROM "subscriptionSchema"
        ) AS all_data
        WHERE 
          EXTRACT(YEAR FROM "createdAt") = EXTRACT(YEAR FROM CURRENT_DATE)
          AND "authorId" = ${session.user.id}
        GROUP BY TO_CHAR("createdAt", 'Mon'), EXTRACT(MONTH FROM "createdAt")
        ORDER BY month_number
      `
    );

  

    return NextResponse.json(results.rows);
  } catch (error) {
    console.error('[API_USAGE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
