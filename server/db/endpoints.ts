"use server"
import { db } from "@/db"
import { endpoints } from "@/db/schema"
import { auth } from "@/lib/auth"
import { and, eq, InferModel, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export const createEndpoint = async (projectId : string , name : string , schema : string) => { 
    const session = await auth()
    
        if (!session) { 
            return null
        }
        try { 
            
           const project = await db.insert(endpoints).values({ 
            projectId,
            name ,
            schema, 
            userId : session.user.id ,
           }).returning()
           
           
            return project[0]
            
            
        } catch(error) { 
            console.log(error)
            return null
        }
} 

export const getEndpoints = async ({id,take , page,q,filter} : {id: string,take : number ,page : number,q : string | null , filter : string | null}) => { 
  
    
    
    

    
    try { 
        const conditions = [eq(endpoints.projectId, id)];
        if (q) {
            conditions.push(sql`${endpoints.name} ILIKE ${q + '%'}`); // case-insensitive match
          }

        if (filter) { 
            conditions.push(eq(endpoints.schema, filter)); // case-insensitive match
        }
        const result = await db.query.endpoints.findMany({
            where: and(...conditions),
            limit: take,
            offset: take * page,
            orderBy: (endpoints) => [endpoints.createdAt],
        }); 

        

       
        return result
        
        
    } catch(error) { 
        console.log(error)
        return null
    }
}
export const getEndpoint = async (id : string) => { 
    const session = await auth()

    if (!session) { 
        return null
    }
    try { 
        
       const project = await db.query.endpoints.findFirst({ 
            where : and(eq(endpoints.id , id),eq(endpoints.userId , session.user.id) )
       })
       
       
        return project ?? null
        
        
    } catch(error) { 
        console.log(error)
        return null
    }
}

type Endpoint = Partial<InferModel<typeof endpoints>>;
export const updatEndpointById = async (id : string, options :  Endpoint) => { 
   
    try { 
        await db.update( endpoints).set({
            ...options,
            
        }).where(eq(endpoints.id, id))

        revalidatePath(`/endpoints/${id}`)
        return "success"
    } catch(error) { 
        console.log(error)
        return null
    }
    
}

export const deleteEndpoint = async (id : string) => { 
    const session = await auth()

    if (!session) { 
        return null
    }
    try { 
        const data = await db.delete(endpoints).where(and(eq(endpoints.id, id),eq(endpoints.userId,session.user.id))).returning()

        
        return data[0]
    } catch(error) { 
        console.log(error)
        return null
    }
}

