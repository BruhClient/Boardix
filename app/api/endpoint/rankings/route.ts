import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql, eq, and } from "drizzle-orm";
import { endpoints } from "@/db/schema";
import { format } from "date-fns";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const endpointId = url.searchParams.get("endpointId") ?? "";
    const filter = url.searchParams.get("filter") ?? "month";
    const year = url.searchParams.get("year") ?? format(Date.now(), "yyyy");
    const field = url.searchParams.get("field") ?? "amount"; // default to 'amount'

    const groupField = url.searchParams.get("groupField") ?? "userId";

    const limit = url.searchParams.get("limit"); 

   

    const session = await auth()
    const endpoint = await db.query.endpoints.findFirst({ 
          where : and(eq(endpoints.id,endpointId),eq(endpoints.userId,session!.user.id)),
    })

    if (!endpoint) {
      return new NextResponse("Endpoint doesn't exist", { status: 400 });
    }

    const { schema } = endpoint;

    const now = new Date();
    let start: Date;
    let end: Date;

    switch (filter) {
      case "last-month":
        start = new Date(parseInt(year), now.getMonth() - 1, 1);
        end = new Date(parseInt(year), now.getMonth(), 1);
        break;
      case "year":
        start = new Date(parseInt(year), 0, 1);
        end = new Date(parseInt(year) + 1, 0, 1);
        break;
      case "month":
      default:
        start = new Date(parseInt(year), now.getMonth(), 1);
        end = new Date(parseInt(year), now.getMonth() + 1, 1);
        break;
    }
    
    const tableIdentifier = sql.identifier(`${schema.toLowerCase()}Schema`);
    const limitClause = limit !== "undefined" ? sql`LIMIT ${limit}` : sql``;
    const results = await db.execute(sql`
      WITH filtered_amount AS (
        SELECT *
        FROM ${tableIdentifier}
        WHERE "endpointId" = ${endpointId}
          AND "createdAt" >= ${start.toISOString()}
          AND "createdAt" < ${end.toISOString()}
      ),
      top_categories AS (
        SELECT 
          ${sql.raw('"' + groupField + '"')},
          SUM(${sql.raw('"' + field + '"')}) AS "sum"
        FROM filtered_amount
        GROUP BY ${sql.raw('"' + groupField + '"')}
        ORDER BY "sum" DESC
         ${limitClause}
      )
      SELECT 
        (SELECT COUNT(DISTINCT ${sql.raw('"' + groupField + '"')}) FROM filtered_amount) AS "total",
        json_agg(top_categories) AS "top"
      FROM top_categories;
    `);

    
    return NextResponse.json(results.rows);
  } catch (error) {
    console.error("[TOP_USERS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
