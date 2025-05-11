import subscriptionPlans from '@/data/subscriptionPlans';
import { db } from '@/db';
import { endpoints, eventSchema, paymentSchema, projects, subscriptionSchema, users, userSchema } from '@/db/schema';
import { decrypt } from '@/lib/encrypt';
import { formatInputBody } from '@/lib/formatting';
import { getUserById } from '@/server/db/users';
import {  eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';


const updateUser = async (id : string) => { 
  await db
          .update(users)
          .set({
            monthlyUsage: sql<number>`${users.monthlyUsage} + 1`,
          })
  .where(eq(users.id, id));
  
}

export async function POST(
  req: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id : endpointId } =  await params;
    


    const endpoint = await db.query.endpoints.findFirst({ 
      where: eq(endpoints.id, endpointId),
    });

  
    
    if (!endpoint) {
      throw Error("Endpoint doesnt exist")
    }

    if (!endpoint.enabled) { 
      throw Error("Endpoint is offline")
    }

    const project = await db.query.projects.findFirst({ 
        where: eq(projects.id,endpoint.projectId ),
        
    });

    if (!project) { 
        throw Error("Project doesnt exist")
    }

    if (!body.apiKey) { 
        throw Error("Api key missing")
    }

    const {apiKey,userId : projectOwnerId} = project

    const user = await getUserById(projectOwnerId) 

    if (!user) { 
      throw Error("Project User not found")
    }

    const limit = subscriptionPlans.find((plan) => plan.name.toLowerCase() === user.plan )!.monthlyQuota

    if (user.monthlyUsage >= limit) { 
      throw Error("You have reached your monthly quota .")
    }
    const keyMatch = decrypt(apiKey) === body.apiKey.trim()

    if (!keyMatch) { 
        throw Error("Incorrect Api Key")
    }


    const { schema, name : EndpointName} = endpoint;
   
    switch (schema) {
      case "User": {
        const {userId,name,region,tier,role,authProvider,email} = body

        if (!userId) { 
            throw Error("Missing userId")
        }
        const res = formatInputBody(schema,{userId,name,region,tier,role,authProvider,email})

        if (res.status === "error") { 
            throw Error(res.message)
        }
        const duplicate = await db.query.userSchema.findFirst({ 
          where : eq(userSchema.userId,userId)
        })

        if (duplicate) { 
          const data = await db.update(userSchema).set({endpointId,...res.data}).returning()
          
          await updateUser(projectOwnerId)
          return new NextResponse(
            JSON.stringify({ message: `Updated user with userId ${data[0].userId} in ${EndpointName}`, user : data[0] }),
            { status: 200 }
          );

        }
   
        
        

        //@ts-ignore
        const data = await db.insert(userSchema).values({endpointId,...res.data,authorId : projectOwnerId}).returning();
        await updateUser(projectOwnerId)
        return new NextResponse(
          JSON.stringify({ message: `Added 1 user into ${EndpointName}`, user : data[0] }),
          { status: 200 }
        );
        
      }
      case "Subscription": {
        const {userId ,amount , email ,region,type } = body
        if (!userId) { 
            throw Error("Missing userId")
        }

        if (!["Monthly","Yearly"].includes(type)) { 
          throw Error("Invalid Type")
        }
        const res = formatInputBody(schema,{userId,region,type,amount,email})
        console.log("Hello",res)
        if (res.status === "error") { 
            throw Error(res.message)
        }
        const duplicate = await db.query.subscriptionSchema.findFirst({ 
          where : eq(subscriptionSchema.userId,userId)
        })
        if (duplicate) { 
          const data = await db.update(subscriptionSchema).set({endpointId,...res.data , type : type.toLowerCase()}).returning()
          await updateUser(projectOwnerId)
          return new NextResponse(
            JSON.stringify({ message: `Updated Subscription with userId ${data[0].userId} in ${EndpointName}`, user : data[0] }),
            { status: 200 }
          );

        }
   
        
        

        //@ts-ignore
        const data = await db.insert(subscriptionSchema).values({endpointId,...res.data,authorId : projectOwnerId , type : type.toLowerCase()}).returning();
        await updateUser(projectOwnerId)
        return new NextResponse(
          JSON.stringify({ message: `Added 1 Subscription into ${EndpointName}`, user : data[0] }),
          { status: 200 }
        );
        
      }
      case "Payment": {
  
        const {amount,email,userId,paymentType,region,productName} = body

        if (!amount) { 
            throw Error("Missing Amount")
        }
        if (!userId) { 
          throw Error("Missing UserId")
        }
        const res = formatInputBody(schema,{amount,email,userId,paymentType,region,productName})

        if (res.status === "error") { 
            throw Error(res.message)
        }



         //@ts-ignore
        const data = await db.insert(paymentSchema).values({endpointId,...res.data,authorId : projectOwnerId}).returning();
        await updateUser(projectOwnerId)
        return new NextResponse(
          JSON.stringify({ message: `Added 1 payment into ${EndpointName}`, payment : data[0] }),
          { status: 200 }
        );
      }
      case "Event": {
  
        const {eventType,userId,email,region} = body

        if (!eventType) { 
            throw Error("Missing Event Type")
        }
        const res = formatInputBody(schema,{eventType,email,userId,region})

        if (res.status === "error") { 
            throw Error(res.message)
        }


         //@ts-ignore
        const data = await db.insert(eventSchema).values({endpointId,...res.data,authorId : projectOwnerId}).returning();
        await updateUser(projectOwnerId)
        return new NextResponse(
          JSON.stringify({ message: `Added 1 event into ${EndpointName}`, payment : data[0] }),
          { status: 200 }
        );
      }
      default: {
       
        throw Error("Schema not found")
      }
    }

  } catch (error : any) {
    if (error.message) { 
        return new NextResponse(
            JSON.stringify({ error: error.message }),
            { status: 200 }
          );
    }
    return new NextResponse(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400 }
    );
  }
}
