"use server"

import { db } from "@/db"
import { projects } from "@/db/schema"
import { auth } from "@/lib/auth"
import { CreateProjectPayload, CreateProjectSchema } from "@/schema/create-project"
import { eq, sql,gte, and, InferModel  } from "drizzle-orm"
import { startOfWeek } from 'date-fns';
import { revalidatePath } from "next/cache"
import { encrypt } from "@/lib/encrypt"
import { nanoid } from "nanoid"

export const createProject = async (values : CreateProjectPayload) => {
    
    const session = await auth()

    if (!session) { 
        return null
    }
    try { 
        const {name,icon,starred} = CreateProjectSchema.parse(values)
        const res = await db.insert(projects).values({ 
            userId : session.user.id, 
            name , 
            icon, 
            starred,
        }).returning()
        return { 
            id : res[0].id, 
        }
    } catch(error) { 
        console.log(error)
        return null
    }
}

export const getProjects = async ({take , page,q,filter} : {take : number ,page : number,q : string | null , filter : string | null}) => { 
  
    
    const session = await auth()
    

    if (!session) { 
        return null
    }
    try { 
        const conditions = [eq(projects.userId, session.user.id)];
        if (q) {
            conditions.push(sql`${projects.name} ILIKE ${q + '%'}`); // case-insensitive match
          }

        switch (filter) { 
            case 'starred': {
                conditions.push(eq(projects.starred, true));
                break;
            }
            case 'recent': {
                const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
                conditions.push(gte(projects.createdAt, startOfThisWeek));
                break;
            }
        }
        const result = await db.query.projects.findMany({
            where: and(...conditions),
            limit: take,
            offset: take * page,
            orderBy: (projects) => [projects.createdAt],
        }); 

        

       
        return result
        
        
    } catch(error) { 
        console.log(error)
        return null
    }
}

type Project = Partial<InferModel<typeof projects>>;

export const updateProjectById = async (id : string, options :  Project) => { 
   
    try { 
        await db.update( projects).set({
            ...options,
            updatedAt: new Date(),
        }).where(eq(projects.id, id))

        revalidatePath(`/projects/${id}`)
        return "success"
    } catch(error) { 
        console.log(error)
        return null
    }
    
}

export const deleteProject = async (id : string) => { 
    const session = await auth()

    if (!session) { 
        return null
    }
    try { 
        const data = await db.delete(projects).where(and(eq(projects.id, id),eq(projects.userId,session.user.id))).returning()

        
        return data[0]
    } catch(error) { 
        console.log(error)
        return null
    }
}


export const getProject = async (id : string) => { 
    const session = await auth()

    if (!session) { 
        return null
    }
    try { 
        
       const project = await db.query.projects.findFirst({ 
            where : and(eq(projects.id , id),eq(projects.userId , session.user.id) )
       })
       
       if (!project) { 
            return null
        }
        return project
        
        
    } catch(error) { 
        console.log(error)
        return null
    }
}


export const refreshApiKey = async (id : string) => { 
    const session = await auth()

    if (!session) { 
        return null
    }
    try { 
        const apiKey = encrypt(nanoid(10))

        console.log("API KEY",apiKey)
       const project = await db.update(projects).set({ 
        apiKey,
        updatedAt: new Date(),
       }).where(and(eq(projects.id , id),eq(projects.userId , session.user.id) )).returning()
       
        revalidatePath(`/projects/${id}`)
        return project[0]
        
        
    } catch(error) { 
        console.log(error)
        return null
    }
}