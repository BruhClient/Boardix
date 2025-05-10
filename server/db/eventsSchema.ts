"use server"

import { db } from "@/db"
import { eventSchema } from "@/db/schema"
import { auth } from "@/lib/auth"
import { and, eq } from "drizzle-orm"

export const deleteEventSchema = async (id : string) => { 
    const session = await auth()

    if (!session) { 
        return null
    }
    try { 
            const data = await db.delete(eventSchema).where(eq(eventSchema.id, id)).returning()
    
            
            return data[0]
        } catch(error) { 
            console.log(error)
            return null
    }
    
}