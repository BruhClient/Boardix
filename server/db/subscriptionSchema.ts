"use server"

import { db } from "@/db"
import { eventSchema, subscriptionSchema } from "@/db/schema"
import { auth } from "@/lib/auth"
import { and, eq } from "drizzle-orm"

export const deleteSubscriptionSchema = async (id : string) => { 
    const session = await auth()

    if (!session) { 
        return null
    }
    try { 
            const data = await db.delete(subscriptionSchema).where(eq(subscriptionSchema.id, id)).returning()
    
            
            return data[0]
        } catch(error) { 
            console.log(error)
            return null
    }
    
}