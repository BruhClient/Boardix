"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { schemas } from '@/data/schemas'
import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const SchemaGrid = () => {

    const searchParams = useSearchParams()
  return (
    <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'>
      {
        schemas.map((schema) => {
            if (schema.name.toLowerCase().startsWith(searchParams.get("q")?.toLowerCase() ?? "")) return <Card key={schema.name}>
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
        })
      }
    </div>
  )
}

export default SchemaGrid
