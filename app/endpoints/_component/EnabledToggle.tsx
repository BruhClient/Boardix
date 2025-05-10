"use client"

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { updatEndpointById } from '@/server/db/endpoints'
import { useQueryClient } from '@tanstack/react-query'
import React, { useState, useTransition } from 'react'
import toast from 'react-hot-toast'

const EnabledToggle = ({id ,enabled,projectId } : {id : string, enabled : boolean,projectId : string}) => {
    const [isPending,startTransition] = useTransition()
    const [isEnabled,setIsEnabled] = useState(enabled)
    const queryClient = useQueryClient()
    const toggleEnabled = (checked : boolean) => { 
        startTransition(() => { 
            updatEndpointById(id,{enabled : checked}).then((data) => {
                if (!data) { 
                    toast.error("Something went wrong")
                } 
                else { 
                   
                    queryClient.invalidateQueries({queryKey : ["Endpoints",projectId]})
                }
            })
            
        })
        setIsEnabled(checked)
    }
  return (
    
    <Switch checked={isEnabled} onCheckedChange={(checked) => toggleEnabled(checked)}/>
            
  
  
  )
}

export default EnabledToggle
