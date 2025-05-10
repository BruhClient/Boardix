
import NextAuth from "next-auth"

import authConfig from "./lib/auth-config"
import { NextResponse } from "next/server"


const authRoutePrefix = "/api/auth"
const authRoutes = [
    "/signin" , 
    "/signup" , 
    
    
]

const publicRoutes = [
    "/", 
    "/account-verification",
    "/api/uploadthing",
    
    
    
]


const {auth} = NextAuth(authConfig)

export default auth((req) => { 
    const {nextUrl} = req

    const isLoggedIn = !!req.auth

    if (nextUrl.pathname.includes(authRoutePrefix)) { 
        return NextResponse.next()
    }

    if (nextUrl.pathname.includes("/api/stripe/webhook")) { 
        return NextResponse.next()
    }

    if (nextUrl.pathname.includes("/api/ep")) { 
        return NextResponse.next()
    }

   

    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    
    

    if (isAuthRoute) { 
        if (isLoggedIn) { 
            return NextResponse.redirect(new URL("/dashboard",nextUrl))
        }
        return NextResponse.next()
    }

    if (!isPublicRoute) { 
        if (isLoggedIn) { 
            return NextResponse.next()
        }
        return NextResponse.redirect(new URL("/",nextUrl))
    } 
   
    
    
    
    
    
   


   
   

})

export const config = { 
    matcher : ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"]
}