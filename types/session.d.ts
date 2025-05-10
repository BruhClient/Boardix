
import { DefaultSession } from "next-auth"


type UserRole = typeof User['role'];
export type  ExtendedUser = DefaultSession["user"] & { 
    role : UserRole, 
    id : string,
    name : string,
    image : string, 
    isOauth : boolean, 
    plan : "free" | "pro", 
    monthlyUsage : number , 
    
}

declare module "next-auth" { 
    interface Session {
        user : ExtendedUser
    }
}