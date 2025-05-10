"use client"
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit } from 'lucide-react'
import EditProjectForm from './EditProjectForm'
import { Button } from '@/components/ui/button'
const EditProjectButton = ({id,name,starred,icon} : {id : string,name : string ,starred : boolean,icon : string}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
            <Button size={"icon"} variant={"outline"}>
                <Edit />
            </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Edit size={20}/>Edit Project
          </DialogTitle>
          <DialogDescription>
            Projects have enpoints which contain schemas.
          </DialogDescription>
        </DialogHeader>
        <EditProjectForm id={id} name={name} starred={starred} icon={icon}/>
      </DialogContent>
    </Dialog>
  )
}

export default EditProjectButton
