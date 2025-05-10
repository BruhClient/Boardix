

import { db } from '@/db';
import { endpoints } from '@/db/schema';
import { auth } from '@/lib/auth';
import { format } from 'date-fns';
import { and, eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url); // Parse the URL to extract query parameters
    const endpointId = url.searchParams.get('endpointId') ?? "";
    const filter = url.searchParams.get('filter') ?? 'month'; // Default to 'month' if not provided
    const year = url.searchParams.get('year') ?? format(Date.now(),"yyyy")
    const field = url.searchParams.get('field')
 
    if (!field) { 
        return new NextResponse('Field does not exist', { status: 400 });
    }


    const session = await auth()
    const endpoint = await db.query.endpoints.findFirst({ 
          where : and(eq(endpoints.id,endpointId),eq(endpoints.userId,session!.user.id)),
        })
        
    if (!endpoint) {
          return new NextResponse('Endpoint doesnt exist', { status: 400 });
    }
    
    const {schema} = endpoint
    const tableIdentifier = sql.identifier(`${schema.toLowerCase()}Schema`);
    const now = new Date();
    let start: Date;
    let end: Date;

    // Handle date range based on filter
    switch (filter) {
      case 'last-month':
        // Previous month
        start = new Date(parseInt(year), now.getMonth() - 1, 1);
        end = new Date(parseInt(year), now.getMonth(), 1);
        break;
      case 'year':
        // Current year
        start = new Date(parseInt(year), 0, 1); // January 1st of the current year
        end = new Date(parseInt(year) + 1, 0, 1); // January 1st of the next year
        break;
      case 'month':
      default:
        // Current month
        start = new Date(parseInt(year), now.getMonth(), 1); // First day of the current month
        end = new Date(parseInt(year), now.getMonth() + 1, 1); // First day of the next month
        break;
    }
    
    const result = await db.execute(
        sql`
            SELECT
            "${sql.raw(field)}",
            COUNT(*) AS count
            FROM ${tableIdentifier}
            WHERE "endpointId" = ${endpointId}
            AND "createdAt" >= ${start.toISOString()}
            AND "createdAt" < ${end.toISOString()}
            GROUP BY "${sql.raw(field)}"
            ORDER BY count DESC;
            `
      );


    
      const formattedResult = result.rows.map((row) => { 
        

        const obj = {}
        //@ts-ignore
        obj["count"] = parseInt(row["count"])
        //@ts-ignore
        obj[field] = row[field] ?? "NIL"

        return obj

        
      } )

      return NextResponse.json(formattedResult);
    


    

    
  } catch (error) {
    console.error('[ERROR]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
