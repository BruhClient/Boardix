
import {z} from "zod"


export const CreateEndpointSchema = z.object({ 
    
    name : z.string().min(1,{message : "Endpoint Name is required."}).max(30,{message : "Endpoint Name cannot exceed 30 characters."}).trim(),
    schema : z.string().min(1,{message : "Please select a schema."}), 
   


})

export type CreateEndpointPayload = z.infer<typeof CreateEndpointSchema>