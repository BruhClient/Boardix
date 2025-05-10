"use client"

import { createPaymentIntent } from "@/server/actions/stripe"
import { useEffect, useState } from "react"

export const useCheckout = (price : number ) => { 
    const [loading,setLoading] = useState(true)
    const [clientSecret,setClientSecret] = useState<string | null>(null)


    async function fetch() { 
        const intent = await createPaymentIntent(price)
        
        setClientSecret(intent)
        setLoading(false)
    }


    useEffect(() => {
        fetch()
    },[])
    return {loading,clientSecret}
}