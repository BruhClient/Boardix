// app/api/projects/route.ts
import { NextRequest } from "next/server"

import { db } from "@/db"
import { endpoints,  subscriptionSchema } from "@/db/schema"
import { eq, and, sql, desc } from "drizzle-orm"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  
  const take = parseInt(searchParams.get("take") ?? "10")
  const page = parseInt(searchParams.get("page") ?? "0")
  const id = searchParams.get("id") ?? "0"

  const type = searchParams.get("type")

  const userId = searchParams.get("userId")
  

  const session = await auth()
  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }
  const endpoint = await db.query.endpoints.findFirst({ 
      where : and(eq(endpoints.id,id), eq(endpoints.userId,session.user.id))
    })
  
  if (!endpoint) {
      return new Response("Endpoint not found", { status: 401 })
    }

  try {
    const conditions = [eq(subscriptionSchema.endpointId, id)]

    if (userId) {
      conditions.push(sql`${subscriptionSchema.userId} ILIKE ${userId + "%"}`)
    }

    if (type) {
      conditions.push(sql`${subscriptionSchema.type} ILIKE ${type + "%"}`)
    }

    

    const result = await db.query.subscriptionSchema.findMany({
      where: and(...conditions),
      limit: take,
      offset: take * page,
      orderBy: (events) => [desc(events.createdAt)],
    })

    

    return Response.json(result)
  } catch (error) {
    return new Response("Server error", { status: 500 })
  }
}
