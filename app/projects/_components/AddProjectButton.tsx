import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React from 'react'
import CreateProjectForm from './CreateProjectForm'
import { Plus } from 'lucide-react'

const AddProjectButton = () => {
 
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
              Add Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Plus size={15}/>Create Project
          </DialogTitle>
          <DialogDescription>
            Projects have enpoints which contain schemas.
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm />
      </DialogContent>
    </Dialog>
    
  )
}

export default AddProjectButton
