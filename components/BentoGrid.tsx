"use client"


import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { projectIcons } from '@/data/project'
import { ChartColumnIncreasing, LucideIcon, Plus, Sparkles, Star } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import FetchCodeBlock from '@/app/endpoints/_component/CodeBlock'

import PieGraph from './PieGraph'
import { cn, getTimelineDescription } from '@/lib/utils'
import { env } from '@/data/env/client'
import { schemas } from '@/data/schemas'
const BentoGrid = () => {
  return (
    <div className='grid grid-cols-12 w-full h-full max-w-[1200px] gap-3'>
        <Step1 />
        <Step2 />
        <Step3 />
        <Analytics1 />
        <Analytics2 />
    </div>
  )
}


export default BentoGrid

const Step1 = () => { 
   
    return <div className='lg:col-span-6 bg-muted/30 rounded-lg px-5 py-4 col-span-12 flex flex-col gap-3'>
        <div>
            <div className='text-lg font-bold'>
                Step 1 : Create a Project
            </div>
            <div className='text-muted-foreground text-sm'>
                More Icons coming soon !
            </div>
        </div>
        
        <div>
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <ChartColumnIncreasing size={15}/>Create Project
                </CardTitle>
                <CardDescription>
                    What's on your mind ?
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-3'>
                    <Input  placeholder='Project Name'/> 
                    <div className='flex gap-2'>
                        {
                            projectIcons.map(({icon,name}) => { 
                                const Icon = icon as LucideIcon
                                return <Button key={name} size={"icon"} variant={"outline"}><Icon /></Button>
                            })
                        }
                    </div>
                    <div className='w-full flex items-center gap-1'>
                        <Button className='flex-1' >
                            Create Project
                        </Button>
                        <Button variant={"outline"} size={"icon"}>
                            <Star />
                        </Button>
                    </div>
                   
                    
                </div>
                
            </CardContent>
            
        </Card>
        </div>
    </div>
}

const Step2 = () => { 
    return <div className='col-span-12 lg:col-span-6 bg-muted/30 px-5 py-4 flex flex-col gap-3 rounded-lg'>
        <div>
            <div className='text-lg font-bold'>
                Step 2 : Create a Endpoint
            </div>
            <div className='text-muted-foreground text-sm'>
                More Schemas coming soon !
            </div>
        </div>
        <div>
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <ChartColumnIncreasing size={15}/>Create Endpoint
                </CardTitle>
                <CardDescription>
                Choose a schema that best fits your data
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-3'>
                    <Input  placeholder='Endpoint Name'/> 
                    
                    <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Schema" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Payment">Payment</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                    </SelectContent>
                    </Select>
                   
                    <Button className='w-full'>
                        Create Endpoint
                    </Button>
                </div>
                
            </CardContent>
            
        </Card>
        </div>
    </div>
}

const Step3 = () => { 
    return <div className='col-span-12 bg-muted/30 px-5 py-4 flex flex-col gap-3 rounded-lg'>
        <div>
            <div className='text-lg font-bold'>
                Step 3 : Call the Endpoint
            </div>
            <div className='text-muted-foreground text-sm'>
                You have connected your app to our services !
            </div>
        </div>
        <div>
            <FetchCodeBlock
                                    url={`${env.NEXT_PUBLIC_VERCEL_URL}/api/ep/87283718927312`}
                                    method="POST"
                                    headers={{
                                      'Content-Type': 'application/json',
                                      
                                    }}
                                    body={{
                                      apiKey : "< YOUR PROJECT API TOKEN >", 
                                      eventType : "< MANDATORY STRING VALUE >", 
                                      userId : "< OPTIONAL STRING VALUE >", 
                                      region : "< OPTIONAL STRING VALUE >"
                                     
                                  
                                    }}
            /> 
        </div>
    </div>
}

const Analytics1 = () => { 
    return <div className='col-span-12 lg:col-span-6 bg-muted/30 px-5 py-4 flex flex-col gap-3 rounded-lg'>
    <div>
        <div className='text-lg font-bold'>
            Interative Graphs
        </div>
        <div className='text-muted-foreground text-sm'>
            Make more informed decisions by getting to know your data better
        </div>

    </div>
    <div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Total Sales by Region
                    </CardTitle>
                    <CardDescription>
                        {getTimelineDescription("month")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PieGraph data={[{region : "NIL", count : 3},{region : "Asia", count : 7},{region : "Europe", count : 2},{region : "Americas", count : 13},{region : "Africa", count : 8},{region : "Australia", count : 4}]} fieldType='region' sum='count' />
                </CardContent>
                <CardFooter className='w-full flex justify-center'>
                    <div className='text-sm text-muted-foreground text-center'>
                        3% of the calls made had region undocumented
                    </div>
                </CardFooter>
            </Card>
           
        </div>
</div>
}

const Analytics2 = () => { 

    const schema = schemas.find((schema) => schema.name === "User")!
    return <div className='col-span-12 lg:col-span-6 bg-muted/30 px-5 py-4 flex flex-col gap-3 rounded-lg'>
    <div>
        <div className='text-lg font-bold'>
            Clear Documentation
        </div>
        <div className='text-muted-foreground text-sm'>
            Check out all of our schemas !
        </div>
        

    </div>
    <div className='text-sm text-muted-foreground'>
            <span className='text-destructive pr-2'>*</span> indicates that field is a primary key and must be provided
    </div>
    <div className='text-sm text-muted-foreground'>
            <span className='text-foreground pr-2'>*</span> indicates that field must be provided
    </div>
    <div className='flex-1 flex justify-center-items-center'>

    <Card key={schema.name}>
                <CardHeader>
                    <CardTitle className='flex gap-2 items-center'>
                        {schema.name} {schema.planType === "Free" ? <div className='text-xs border-2 px-2 py-1 rounded-full'>{schema.planType}</div>: <div className='text-xs border-2 px-2 py-1 bg-foreground text-background rounded-full flex items-center gap-1'><Sparkles size={13} className='animate-pulse'/>{schema.planType}</div> }
                    </CardTitle>
                    <CardDescription>
                        {schema.description}
                    </CardDescription>
                    
                </CardHeader>
                <CardContent>
                    {
                        schema.fields.map((field) => { 
                            return <div key={field.name} className='flex w-full justify-between'>
                                <div className='font-semibold'>
                                    {field.name} <span className={cn(field.unique ? "text-destructive" : "")}>{(field.required || field.unique) && "*"}</span>
                                </div>
                                <div>
                                    {field.type}
                                </div>
                               
                            </div>
                        })
                    }
                </CardContent>
                <CardFooter className='flex flex-col justify-end items-start gap-1 h-full'>
                    <div className='text-sm text-muted-foreground'>
                        {schema.keyNotes}
                    </div>
                    
                    
                    
                </CardFooter>
    </Card>

            
           
    </div>

    
   

    
</div>
}


