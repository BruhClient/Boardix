
import { projectIcons } from '@/data/project'
import { getProject } from '@/server/db/projects'
import { format } from 'date-fns'
import {  Star } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import { ApiKeyField } from '../_components/ApiKeyDisplay'
import EditProjectButton from '../_components/EditProjectButton'
import CreateEndpointButton from './_component/CreateEndpointButton'
import Searchbar from './_component/Searchbar'
import EndpointsList from './_component/EndpointsList'
import { decrypt } from '@/lib/encrypt'

const ProjectPage = async ({params} : {params : Promise<{slug : string}>}) => {
    const slug = (await params).slug[0]

    const project = await getProject(slug)

    

    
    if (!project) { 
        redirect("/projects")
    }
    const LuicideIcon = projectIcons.find((icon) => project.icon === icon.name)!.icon
  return (
    <div className='lg:px-10 px-5 pt-3 flex flex-col  gap-3 pb-8'>
        <div className='flex items-center  justify-between flex-wrap gap-3'>
            <div className='flex items-center gap-3 '>
                <div className='bg-primary w-fit p-3 rounded-full'>
                    <LuicideIcon size={30} stroke="black"/>
                </div>
                <div >
                    <div className='text-3xl font-bold break-all flex items-center gap-2'>
                        {project.name} {project.starred && <Star size={15} className='stroke-amber-400 fill-amber-400'/>}
                    </div>
                    <div className='text-muted-foreground'>
                        {format(project.createdAt,"dd-MM-yyyy")}
                    </div>
                    
                </div>
            </div>

            <EditProjectButton id={project.id} starred={project.starred!} icon={project.icon} name={project.name} />
        </div>
        <div className='flex items-end justify-between w-full flex-wrap gap-3'>
            <ApiKeyField apiKey={decrypt(project.apiKey)} id={slug}/>
            <CreateEndpointButton id={slug}/>
        </div>
        <div>
            <Searchbar />
        </div>
        <EndpointsList id={slug}/>
        

        
        
        
    </div>
  )
}

export default ProjectPage
