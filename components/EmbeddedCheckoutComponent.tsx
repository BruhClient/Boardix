
import React, { useState, useTransition } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { DropdownMenuItem } from './ui/dropdown-menu'
import { Check, Sparkles } from 'lucide-react'
import { useCheckout } from '@/hooks/use-checkout'
import { loadStripe } from '@stripe/stripe-js'
import {Elements, PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js"
import { env } from '@/data/env/client'
import { Button } from './ui/button'
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const EmbeddedCheckoutComponent = () => {
    const {loading,clientSecret} = useCheckout(25)
    
    
  return (
    <Dialog>
  <DialogTrigger asChild>
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        <Sparkles /> Upgrade to Pro
    </DropdownMenuItem>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className='flex items-center gap-2'> <Sparkles size={17} className='animate-pulse'/>Pro Plan</DialogTitle>
      <div className='flex gap-2 flex-col py-2'>
        <div className='flex items-center gap-2'>
            <div className='bg-green-400 w-fit p-1 rounded-full'>
                <Check color='black' size={14}/>
            </div>
            <div className='text-foreground'>
                50000 API request
            </div>
        </div>
        <div className='flex items-center gap-2'>
            <div className='bg-green-400 w-fit p-1 rounded-full'>
                <Check color='black' size={14}/>
            </div>
            <div className='text-foreground'>
                Advanced Schemas
            </div>
        </div>
       
      </div>
      {!clientSecret ? "loading": <Elements stripe={stripePromise} options={{clientSecret : clientSecret, appearance : {theme : "stripe"} }}>
            <CheckoutComponent clientSecret={clientSecret}/>
              
            
          </Elements>}
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default EmbeddedCheckoutComponent

const CheckoutComponent = ({clientSecret } : {clientSecret : string}) => { 
    const stripe = useStripe()

    const elements = useElements()
    const [isPending,startTransition] = useTransition()
    const [error,setError] = useState("")
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault()
        
        if (!stripe || !elements) { 
            return
        }
        startTransition(async () => { 
            const {error : submitError} = await elements.submit()

            if (submitError) { 
                setError(submitError.message!)
                return 
            }

            const {error} = await stripe.confirmPayment({ 
                elements, 
                clientSecret, 
                confirmParams : {
                    return_url: `${env.NEXT_PUBLIC_VERCEL_URL}/success`
                }, 
            })
            if (error) { 
                setError(error.message!)
                return 
            }
        })
        
        
    }
    return <form id='payment-form' className='flex flex-col gap-2' onSubmit={handleSubmit} >
    <PaymentElement />
    <Button className='rounded-lg bg-black hover:bg-black/80 border-[1px] border-amber-200 h-16 text-white' disabled={isPending}>
        Pay $25
    </Button>
</form>
}
