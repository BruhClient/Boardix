"use client"



import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CreateEndpointPayload, CreateEndpointSchema } from '@/schema/create-endpoint'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createEndpoint } from '@/server/db/endpoints'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'

const CreateEndpointForm = ({id,schemaNames} : {id : string,schemaNames : string[]}) => {
  const form = useForm(
    { 
      resolver : zodResolver(CreateEndpointSchema), 
      defaultValues : { 
        name : "",
        schema : "" 
        
      }
    }
  )


  const [isPending,startTransition] = useTransition()
  const queryClient = useQueryClient()
  const onSubmit = (values : CreateEndpointPayload) => {
    startTransition(() => { 
      createEndpoint(id,values.name,values.schema).then((data) => { 
        if (!data) { 
          toast.error("Something went wrong")
        } else{ 
          toast.success("Endpoint created")
          form.reset()
          queryClient.invalidateQueries({queryKey : ["Endpoints",id]})
        }
      })
    })
   }
   
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
          <FormField
                                  control={form.control}
                                  name ="name"
                                  render={({field}) => (
                                      <FormItem >
                                          
                                          <FormControl>
                                              <Input {...field} type="text" placeholder="Endpoint name"/>
                                              
                                          </FormControl>
                                      
          
                                         <FormMessage />
                                      </FormItem>
          
                                      
                                      
                                  )}
            />
            <FormField
                                    control={form.control}
                                    name ="schema"
                                    render={({field}) => (
                                        <FormItem >
                                            
                                            <FormControl>
                                            <Select value={field.value} onValueChange={(value) => {
                                              field.onChange(value)
                                              
                                              }}>
                                              <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select a schema" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {schemaNames.map((name) => <SelectItem value={name} key={name}>{name}</SelectItem>)}
                                              </SelectContent>
                                            </Select>
                                                
                                            </FormControl>
                                        
            
                                           <FormMessage />
                                        </FormItem>
            
                                        
                                        
                                    )}
              />

              
              

              
              
              <Button type='submit' className='w-full' disabled={isPending}>{isPending ? <span className='flex items-center gap-3'><ClipLoader size={15}/> Creating Endpoint...</span>: "Create Endpoint"}</Button>
              <Link  href={"/schemas"} className='text-xs text-muted-foreground flex w-full justify-center hover:underline hover:underline-offset-2'>
                Confused on what schema to use ? View Schemas 
              </Link>



            
      </form>
    </Form>
  )
}

export default CreateEndpointForm
