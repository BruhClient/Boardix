// app/api/projects/route.ts
import { NextRequest } from "next/server"

import { db } from "@/db"
import { projects } from "@/db/schema"
import { eq, and, gte, sql } from "drizzle-orm"
import { startOfWeek } from "date-fns"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  
  const take = parseInt(searchParams.get("take") ?? "10")
  const page = parseInt(searchParams.get("page") ?? "0")
  const q = searchParams.get("q")
  const filter = searchParams.get("filter")

  const session = await auth()
  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const conditions = [eq(projects.userId, session.user.id)]

    if (q) {
      conditions.push(sql`${projects.name} ILIKE ${q + "%"}`)
    }

    switch (filter) {
      case "starred":
        conditions.push(eq(projects.starred, true))
        break
      case "recent":
        const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
        conditions.push(gte(projects.createdAt, startOfThisWeek))
        break
    }

    const result = await db.query.projects.findMany({
      where: and(...conditions),
      limit: take,
      offset: take * page,
      orderBy: (projects) => [projects.createdAt],
    })

    return Response.json(result)
  } catch (error) {
    console.error(error)
    return new Response("Server error", { status: 500 })
  }
}
