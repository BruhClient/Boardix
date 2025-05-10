import { DateFilterProvider } from '@/context/DateFilterContext'
import { SearchProvider } from '@/context/SearchContext'
import React from 'react'

const EndpointDetailLayouts = ({children} : {children : React.ReactNode}) => {
  return (
    <SearchProvider>
      <DateFilterProvider>
            {children}
      </DateFilterProvider>
    </SearchProvider>
   
  )
}

export default EndpointDetailLayouts
