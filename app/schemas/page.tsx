import React from 'react'
import SchemaSearchbar from './_component/SchemaSearchbar'
import SchemaGrid from './_component/SchemaGrid'

const SchemaPage = () => {
  return (
    <div className='lg:px-10 px-5 py-3 flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
            <div className='text-4xl font-bold'>
                Schemas
            </div>
            <div className='text-muted-foreground font-serif'>
                Schemas define the parameters of your endpoints . They also define how your data will be analysed . 
            </div>
            
              <div className='text-sm text-muted-foreground'>
                        <span className='text-destructive pr-2'>*</span> indicates that field is a primary key and must be provided
                    </div>
                    <div className='text-sm text-muted-foreground'>
                        <span className='text-foreground pr-2'>*</span> indicates that field must be provided
                    </div>
              </div>
        
      <SchemaSearchbar />
      
      <SchemaGrid />
    </div>
  )
}

export default SchemaPage
