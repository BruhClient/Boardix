"use client"
import { useProjects } from '@/hooks/use-projects'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import ProjectCard from './ProjectCard'
import { useIntersection } from '@mantine/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import AddProjectButton from './AddProjectButton'
import { Upload } from 'lucide-react'

const ProjectGrid = () => {
    const searchParams = useSearchParams()
    const {projects,fetchNextPage,hasNextPage,isFetching} = useProjects({q : searchParams.get("q") ?? "",filter : searchParams.get("filter") ?? ""}) 


    
    
    const lastProjectRef = useRef<HTMLLIElement>(null)
    const { ref, entry } = useIntersection({
      root: lastProjectRef.current,
      threshold: 1, 
    });


  useEffect(() => { 
    if (entry?.isIntersecting && hasNextPage && !isFetching) { 
        fetchNextPage()
    }
},[entry])
  return (
    <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'>
      {
        projects.length === 0 && !isFetching && <div className='w-full min-h-[70vh] flex justify-center items-center col-span-3 flex-col gap-4'>
          <div>
            <Upload size={30}/>
          </div>
          <div className='text-2xl'>
            No Projects Found.
          </div>
          <AddProjectButton />
          </div>
      }
      {
        projects.map(({id,name,createdAt,starred,icon,updatedAt},index) => {
          if (index === projects.length -1) { 
            return <div ref={ref} key={id}> <ProjectCard icon={icon} name={name} id={id} createdAt={createdAt} starred={starred ?? false} key={id} updatedAt={updatedAt!}/></div>
          }
          return <div key={id}><ProjectCard icon={icon} name={name} id={id} createdAt={createdAt} starred={starred ?? false} key={id} updatedAt={updatedAt!}/></div>
        })
      }
      {isFetching && <Skeleton className='h-full w-full min-h-[150px] rounded-lg'/>}
    </div>
  )
}

export default ProjectGrid
