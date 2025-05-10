import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { projectIcons } from '@/data/project'
import { cn, timeAgo } from '@/lib/utils'
import { deleteProject, updateProjectById } from '@/server/db/projects'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { LucideIcon, Star, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import {usePrevious} from "@mantine/hooks"
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
const ProjectCard = ({id ,name , createdAt, icon , starred, updatedAt} : {id : string, name : string , createdAt : Date , icon : string, starred : boolean, updatedAt : Date}) => {
    const ProjectIcon = projectIcons.find((projectIcon) => projectIcon.name == icon)?.icon as LucideIcon
    const router = useRouter()
  return (
    <Card className="hover:bg-muted transition-colors duration-300 cursor-pointer" onClick={() => router.push(`/projects/${id}`)}>
      <CardHeader className='flex'>
        <div className='flex items-center w-full justify-between'>
            <div className='bg-primary w-fit p-3 rounded-full '>
                <ProjectIcon size={20} stroke='black'/>
            </div>
            <div className='flex gap-2'>
              <StarredButton id={id} starred={starred}/>
              <DeleteButton id={id}/>
            </div>
            
        </div>
        
        
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <div className='text-3xl font-semibold break-all'>
            {name}
        </div>
        <div className='flex w-full justify-between text-sm'>
          <div className='text-muted-foreground'>
              Start date : {format(createdAt,"dd-MM-yyyy")}
          </div>
          <div>
            Updated {timeAgo(updatedAt)}
          </div>
        </div>
        
      </CardContent>
    </Card>
  )
}

export default ProjectCard


const DeleteButton = ({id } : {id : string}) => { 
  const [isPending,startTransition] = useTransition()
  const queryClient = useQueryClient()
    return  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button size={"icon"} variant={"destructive"} className='z-50' onClick={(e) => { 
        e.stopPropagation()

      }}><Trash /></Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your project
          from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={(e) => {

          e.stopPropagation()
          
          }}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={(e) => {
          e.stopPropagation()
          startTransition(() => { 
            deleteProject(id).then((data) => { 
              if (!data) { 
                toast.error("Something went wrong")
              } else { 
                toast.success("Project Deleted")
                queryClient.invalidateQueries({queryKey : ["Projects"]})
              }
            })
          })
        }}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
    
}

const StarredButton = ({id ,starred} : {id : string, starred : boolean}) => { 

  const [isStarred,setIsStarred] = useState(starred)
  const previousValue = usePrevious(isStarred)
  const queryClient = useQueryClient()
  const {mutate : star} = useMutation({ 
    mutationKey : ["Starred", id], 
    mutationFn : async () => { 
      
      const data = await updateProjectById(id,{starred : isStarred })
      if (!data) { 
        throw Error("Something went wrong")
      }
      return data 
    }, 
    onMutate: () => { 
      setIsStarred(!isStarred)

    }, 
    onSuccess : () => {
      queryClient.invalidateQueries({queryKey : ["Projects","starred"]})
    },
    onError : () => { 
      toast.error("Something went wrong")
      setIsStarred(previousValue!)
    }
  
  })
  return  <Button size={"icon"} variant={"outline"} className='z-50' onClick={(e) => { 
    e.stopPropagation()
    star()

  }}><Star className={cn(isStarred && "fill-amber-400 stroke-amber-400")}/></Button>
  
}