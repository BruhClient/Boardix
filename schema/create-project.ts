
import {z} from "zod"


export const CreateProjectSchema = z.object({ 
    
    name : z.string().min(1,{message : "Project Name is required."}).max(30,{message : "Project Name cannot exceed 30 characters."}).trim(),
    icon : z.string() , 
    starred : z.boolean().default(false)


})

export type CreateProjectPayload = z.infer<typeof CreateProjectSchema>