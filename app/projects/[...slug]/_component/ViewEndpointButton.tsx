"use client"
import React, { useTransition } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Ellipsis } from 'lucide-react'
import Link from 'next/link'
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
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { deleteEndpoint } from '@/server/db/endpoints'


const ViewEndpointButton = ({id} : {id : string}) => {

  const [isPending,startTransition] = useTransition()
  const queryClient = useQueryClient()
  const handleDelete = () => { 
    startTransition(() => { 
      deleteEndpoint(id).then((data) => { 
        if (!data) { 
          toast.error("Something went wrong")
        } else { 
          toast.success("Endpoint deleted")
          queryClient.invalidateQueries({queryKey : ["Endpoints"]})

        }
      })
    })
  }
  return (
    <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant={"ghost"} size={"icon"}><Ellipsis /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>

    <DropdownMenuItem asChild><Link href={`/endpoints/${id}`}>View</Link></DropdownMenuItem>
    
    <AlertDialog>
      <AlertDialogTrigger asChild>
          <DropdownMenuItem disabled={isPending} variant='destructive' onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
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

    
    
  </DropdownMenuContent>
</DropdownMenu>
  )
}

export default ViewEndpointButton
