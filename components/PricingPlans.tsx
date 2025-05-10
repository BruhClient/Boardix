import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import subscriptionPlans from '@/data/subscriptionPlans'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

const CustomCheck = () => <div className='bg-green-400 p-1 rounded-full '><Check className='text-black' size={15}/></div>
const CustomX = () => <div  className='bg-red-400 p-1 rounded-full '><X size={15} className='text-black'/></div>

const PricingPlans = () => {
  return (
    <div className='flex gap-3 w-full flex-wrap justify-center'>
      {
        subscriptionPlans.map((pricing) => <Card key={pricing.name} className={cn(pricing.isPopular && " border-primary hover:shadow-primary shadow-xl duration-200 ease-in-out transition-all","relative w-full max-w-[500px]")}>
    
        {pricing.isPopular && <div className='absolute top-[-15px] left-[50%] translate-x-[-50%] bg-primary px-3 text-sm py-1 rounded-lg font-serif text-black'>Most Popular</div>}
    <CardHeader>
        <CardTitle className='text-2xl font-serif '>{pricing.name}</CardTitle>
        <CardDescription>{pricing.description}</CardDescription>
    </CardHeader>
    <CardContent className='flex flex-col gap-4'>
            <div>
                    {pricing.discounts && <span className='line-through text-muted-foreground text-start pr-2'>${pricing.discounts}</span>}
                                    
                    <span className='text-4xl font-serif font-bold'>${pricing.price}</span> 
            </div>
            <div className='flex flex-col'>
                <Button className='w-full' variant={"outline"} disabled={true} asChild>
                    <Link href={"/signin"} >
                        Get Started
                    </Link>
                </Button>
                <div className='text-center text-sm text-muted-foreground'>
                    Pay once , use everywhere .
                </div>
            </div>
            

            <div className='flex flex-col gap-2 py-5 px-1'>
                                    <div className='flex items-center text-lg gap-3 font-serif '>
                                        <CustomCheck /> {pricing.monthlyQuota} Api Calls / month
                                    </div>
                                    <div className='flex items-center text-lg gap-3 font-serif '>
                                        {pricing.support ? <CustomCheck /> : <CustomX />} 24/7 support
                                    </div>
                                    <div className='flex items-center text-lg gap-3 font-serif '>
                                        {pricing.analytics ? <CustomCheck /> : <CustomX />} Analytics
                                    </div>
                                    <div className='flex items-center text-lg gap-3 font-serif '>
                                        {pricing.proSchemas ? <CustomCheck /> : <CustomX />} Advanced Schemas
                                    </div>
                                    
                                    

                                    
            </div>
    </CardContent>
</Card> )
      }
    </div>
  )
}

export default PricingPlans
