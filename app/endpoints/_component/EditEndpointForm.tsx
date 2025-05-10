"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { deleteEndpoint, updatEndpointById } from '@/server/db/endpoints'
import { useQueryClient } from '@tanstack/react-query'
import { Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { schemas } from '@/data/schemas'
import { env } from '@/data/env/client'
import FetchCodeBlock from './CodeBlock'

const EditEndpointForm = ({id,name,enabled,schemaName } : {id : string, name : string, enabled: boolean,schemaName : string}) => {

    const [input,setInput] = useState(name)
    
    const [isPending,startTransition] = useTransition()
    
    const changeName = () => { 
        startTransition(() => { 
            updatEndpointById(id,{name : input}).then((data) => {
                if (!data) { 
                    toast.error("Something went wrong")
                } else { 
                    toast.success("Endpoint updated.")
                }
            })
        })
    }
    

    const queryClient = useQueryClient()
    const router = useRouter()
    const handleDelete = () => { 
        startTransition(() => { 
          deleteEndpoint(id).then((data) => { 
            if (!data) { 
              toast.error("Something went wrong")
            } else { 
              toast.success("Endpoint deleted")
              queryClient.invalidateQueries({queryKey : ["Endpoints"]})
              router.push(`/projects/${data.projectId}`)
    
            }
          })
        })
    }

    let formattedFields = [] as any[]
    const  selectedSchema = schemas.find((schema) => schema.name === schemaName )!.fields

    
    selectedSchema.forEach((data) => { 
      // @ts-ignore
      if (data.unique) { 
        // @ts-ignore
        formattedFields[data.name] = `< PRIMARY ${data.type.toUpperCase()} VALUE >`
      } else if (data.required) { 
        // @ts-ignore
          formattedFields[data.name] = `< MANDATORY ${data.type.toUpperCase()} VALUE >`
      } else { 
        // @ts-ignore
        formattedFields[data.name] = `< OPTIONAL ${data.type.toUpperCase()} VALUE >`
      }
      
      return data.name
    })


  return (
    <Dialog>
    <DialogTrigger asChild>
        <Button variant={"outline"} size={"icon"}><Settings/></Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>
                Endpoint settings
            </DialogTitle>
            
        </DialogHeader>
        <FetchCodeBlock
                        url={`${env.NEXT_PUBLIC_VERCEL_URL}/api/ep/${id}`}
                        method="POST"
                        headers={{
                          'Content-Type': 'application/json',
                          
                        }}
                        body={{
                          apiKey : "< YOUR PROJECT API TOKEN >", 
                          ...formattedFields
                      
                        }}
          /> 
        
        <div className='flex gap-1'>
            <Input placeholder='Endpoint Name' defaultValue={input} onChange={(e) => setInput(e.target.value)} className='flex-1'/>
            <Button onClick={() => changeName()} disabled={isPending}>Confirm</Button>
        </div>
        <AlertDialog>
      <AlertDialogTrigger asChild>
          <Button disabled={isPending} variant='destructive'>Delete Endpoint</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your endpoint
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={() => handleDelete()}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
        
        
    </DialogContent>
    </Dialog>
  )
}

export default EditEndpointForm
