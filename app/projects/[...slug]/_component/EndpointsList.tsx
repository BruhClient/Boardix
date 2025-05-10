"use client"
import { useSearchParams } from 'next/navigation'
import { useIntersection } from '@mantine/hooks'
import { useEffect, useRef } from 'react'
import { useEndpoints } from '@/hooks/use-endpoints'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns'
import ViewEndpointButton from './ViewEndpointButton'
const EndpointsList = ({id} : {id : string}) => {
    const searchParams = useSearchParams()
    
    const {endpoints,fetchNextPage,hasNextPage,isFetching} = useEndpoints({id,q : searchParams.get("q") ?? "",filter : searchParams.get("filter") ?? ""}) 


    
    
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
    <Card>
      <CardHeader>
        <CardTitle>
          Endpoints
        </CardTitle>
        <CardDescription>
          Latest endpoints in real time
        </CardDescription>
      </CardHeader>
      <CardContent>
      <Table >
      
      <TableHeader>
        <TableRow>
          
          <TableHead>Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Schema</TableHead>
          <TableHead>Status </TableHead>
          <TableHead className='text-right'></TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody >
        {
          endpoints.map((endpoint,index) => { 
            
             
            if (index === endpoints.length -1) { 
              return <TableRow key={endpoint.id} ref={ref} >
                      <TableCell className="font-medium">{endpoint.name}</TableCell>
                      <TableCell>{format(endpoint.createdAt,"EEEE, MMMM d, yyyy 'at' h:mm a")}</TableCell>
                      <TableCell className='font-semibold'>{endpoint.schema}</TableCell>
                      <TableCell className='font-semibold'>{endpoint.enabled ? <span className='text-green-400'>Online</span>: <span className='text-red-400'>Offline</span>}</TableCell>
                      <TableCell className='text-right'><ViewEndpointButton id={endpoint.id}/></TableCell>
                      
                    </TableRow>
                    

            }
            return <TableRow key={endpoint.id}>
            <TableCell className="font-medium">{endpoint.name}</TableCell>
            <TableCell>{format(endpoint.createdAt,"EEEE, MMMM d, yyyy 'at' h:mm a")}</TableCell>
            <TableCell className='font-semibold'>{endpoint.schema}</TableCell>
            <TableCell className='font-semibold'>{endpoint.enabled ? <span className='text-green-400'>Online</span>: <span className='text-red-400'>Offline</span>}</TableCell>
            <TableCell className='text-right' ><ViewEndpointButton id={endpoint.id}/></TableCell>
            
          </TableRow>
          })
        } 
        
        { 
          isFetching && <TableRow key={"Loading"}>
          <TableCell className="font-medium"><Skeleton className='w-full h-8'/></TableCell>
          <TableCell><Skeleton className='w-full h-8'/></TableCell>
          <TableCell className='font-semibold'><Skeleton className='w-full h-8'/></TableCell>
          <TableCell className='font-semibold'><Skeleton className='w-full h-8'/></TableCell>
          <TableCell className='text-right'><Skeleton className='w-full h-8'/></TableCell>
          
        </TableRow>
        }
      </TableBody>
      <TableFooter>
        
      </TableFooter>
    </Table>
      </CardContent>
      
    </Card>
    
  )
}

export default EndpointsList
