"use server"

import { db } from "@/db"
import { paymentSchema } from "@/db/schema"
import { auth } from "@/lib/auth"
import { eq } from "drizzle-orm"

export const deletePaymentSchema = async (id :  string) => { 
    const session = await auth()

    if (!session) { 
        return null
    }

    try { 
            const data = await db.delete(paymentSchema).where(eq(paymentSchema.id, id)).returning()
           
            return data[0]
        } catch(error) { 
            console.log(error)
            return null
    }
    
}