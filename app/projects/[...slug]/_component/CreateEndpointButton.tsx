import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React from 'react'

import { Plus } from 'lucide-react'
import CreateEndpointForm from './CreateEndpointForm'
import { getSchemaNames } from '@/server/actions/schema'

const CreateEndpointButton = async ({id} : {id : string}) => {
  const schemaNames = await getSchemaNames()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button >
              Add Endpoint
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Plus size={15}/>Create Endpoint
          </DialogTitle>
          <DialogDescription>
            Select a schema and the fields that you need
          </DialogDescription>
        </DialogHeader>
        <CreateEndpointForm id={id} schemaNames={schemaNames} />
        
      </DialogContent>
    </Dialog>
  )
}

export default CreateEndpointButton
