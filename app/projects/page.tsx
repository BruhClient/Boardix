
import React, { Suspense } from 'react'
import ProjectSearchBar from './_components/ProjectSearchBar'
import AddProjectButton from './_components/AddProjectButton'
import ProjectGrid from './_components/ProjectGrid'

const ProjectPage = () => {
  return (
    <div className='lg:px-10 px-5 pt-3 flex flex-col  gap-3'>
        <div className='flex w-fulll items-center justify-between'>
            <div className='text-2xl font-bold'>
                My Projects
            </div>
            <AddProjectButton />
        </div>
        <Suspense>
          <ProjectSearchBar />
        </Suspense>
        
        <Suspense fallback="loading...">
          <ProjectGrid />
        </Suspense>
       
      

    </div>
  )
}

export default ProjectPage
