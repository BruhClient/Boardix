import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'
import React, { useTransition } from 'react'
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
import { SchemaName } from '@/data/schemas'
import { deletePaymentSchema } from '@/server/db/paymentSchema'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { deleteUserSchema } from '@/server/db/userSchema'
import { deleteEventSchema } from '@/server/db/eventsSchema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from 'date-fns'
import { deleteSubscriptionSchema } from '@/server/db/subscriptionSchema'
const ViewButton = ({id,fields,schema,endpointId} : {fields : any, id : string,schema : SchemaName ,endpointId : string}) => {

  const [isPending,startTransition] = useTransition()

  const queryClient = useQueryClient()
  const deleteEntry = () => { 
  switch (schema) { 
    case "Payment" : { 
      startTransition(() => {
        deletePaymentSchema(id).then((data) => {
          if (!data) { 
            toast.error("Something went wrong")
          } else { 
            toast.success("Payment deleted")
            queryClient.invalidateQueries({queryKey : ["paymentSchema",endpointId]})
          }
        })
      })
      break
    } 
    case "User" : {
      startTransition(() => {
        deleteUserSchema(id).then((data) => {
          if (!data) { 
            toast.error("Something went wrong")
          } else { 
            toast.success("User deleted")
            queryClient.invalidateQueries({queryKey : ["userSchema",endpointId]})
          }
        })
      })
      break
    }
    case "Event" : { 
      startTransition(() => {
        deleteEventSchema(id).then((data) => {
          if (!data) { 
            toast.error("Something went wrong")
          } else { 
            toast.success("Event deleted")
            queryClient.invalidateQueries({queryKey : ["eventSchema",endpointId]})
          }
        })
      })
      break
    }
    case "Subscription" : { 
      startTransition(() => {
        deleteSubscriptionSchema(id).then((data) => {
          if (!data) { 
            toast.error("Something went wrong")
          } else { 
            toast.success("Subscription deleted")
            queryClient.invalidateQueries({queryKey : ["subscriptionSchema",endpointId]})
          }
        })
      })
      break
    }
  }
    
    
    

  }

  const omitFields = ["id","endpointId"];

  const list = Object.entries(fields)
  .filter(([key]) => !omitFields.includes(key))
  .map(([key, value]) => {
    if (key === "createdAt") { 
      return ({
        field: key,
        value: format(value as string," MMMM d, yyyy 'at' h:mm a")
      })
    }
    return ({
    field: key,
    value: value
  })});
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"}><Ellipsis /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              View
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Entry Fields</DialogTitle>
              <DialogDescription>   
                  { 
                    list.map(({field,value} : {field : string ,value : any}) => {
                    
                      return  <div className='flex justify-between' key={field}>
                          <div className='text-foreground'>
                            {field}
                          </div>
                          <div>
                            {value}
                          </div>
                      </div>
                    } )
                  }
               
                
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
            
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant='destructive' onSelect={(e) => e.preventDefault()}>
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your {schema}
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteEntry()}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ViewButton
