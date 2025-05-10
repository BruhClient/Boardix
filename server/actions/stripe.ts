"use server"

import { env } from "@/data/env/client"
import { auth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export const createPaymentIntent = async (price : number) => { 
    const userSession = await auth()

    if (!userSession) { 
            return null
    }
    const intent = await stripe.paymentIntents.create({ 
        metadata : { 
            id : userSession.user.id!,
        },
        automatic_payment_methods : {enabled : true},
        amount : price  * 100, 
        currency : "usd", 


    })
    return intent.client_secret
}   