import NextAuth from "next-auth"
import authConfig from "./auth-config"
import { getUserById, updateUserByEmail } from "../server/db/users"
import {nanoid} from "nanoid"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { accounts, userRoleEnum, users } from "@/db/schema"
import { db } from "@/db"



export const { handlers : {GET , POST}, auth, signIn, signOut } = NextAuth({
  pages : {
       
    signIn :"/signin"
  }, 
  events :  {
    async linkAccount ({user}) { 
    
      await updateUserByEmail(user.email!, { 
        emailVerified : new Date(), 
      })
    } ,
    signIn : async ({account,user}) => {
      
      if (account?.type !== "credentials") { 
      
        await updateUserByEmail(user.email!,{ 
          emailVerified : new Date(), 
          isOauth : true, 
          
        })
      }
    }
  },
  adapter: DrizzleAdapter(db, { 
    usersTable : users , 
    accountsTable : accounts, 
  }),
  callbacks : {
    async signIn({user,account}) { 
      if (account?.provider !== "credentials") return true 
      const existingUser = await getUserById(user.id!)
      if (!existingUser?.emailVerified) { 
          return false
      }
      return true 
    }, 

    async session ({session,token}) { 
     

      if (token) { 
          session.user.image = token.image as string 
          session.user.id = token.id as string 
          session.user.isOauth = token.isOauth as boolean
          session.user.role = token.role as typeof userRoleEnum
          session.user.name = token.name as string 
          session.user.plan = token.plan as "free" | "pro"
          session.user.monthlyUsage = token.monthlyUsage as number

      }
      return session
    },
    
    async jwt ({token}) { 

      
      const userExists = await getUserById(token.sub ?? token.id as string)
      if (!userExists) return token

      
      
      const user = await getUserById(token.sub ?? token.id as string)


      return {
        id : user?.id , 
        name : user?.name, 
        isOauth : user?.isOauth, 
        image : user?.image, 
        email : user?.email, 
        role : user?.role, 
        plan : user?.plan, 
        monthlyUsage : user?.monthlyUsage

      }
    }
  },
  session : {strategy : "jwt"}, 
  ...authConfig,
})