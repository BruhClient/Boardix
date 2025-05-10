"use client"

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns'
import { useEvents } from '@/hooks/use-events'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useSearchContext } from '@/context/SearchContext'
import ViewButton from './ViewButton'


const EventTable = ({id} : {id : string}) => {
    const {searchParams} = useSearchContext()
    
    const {events,fetchNextPage,hasNextPage,isFetching} = useEvents({id,eventType : searchParams["eventType"] ?? "" ,userId : searchParams["userId"] ?? "" }) 

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
          
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className='text-center'>User Id</TableHead>
          <TableHead></TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody >
        {
          events.map((event) => { 
            
            
            return <TableRow key={event.id}>
            <TableCell className="font-medium">{event.eventType}</TableCell>
            <TableCell>{format(event.createdAt,"EEEE, MMMM d, yyyy 'at' h:mm a")}</TableCell>
            <TableCell className='text-center'>{event.userId}</TableCell>
            <TableCell className='text-right'><ViewButton id={event.id} schema='Event' fields={event} endpointId={id}/></TableCell>
         
            
            
          </TableRow>
          })
        } 
        
        { 
          isFetching && <>
            <LoadingRow />
            <LoadingRow />
            <LoadingRow />
          </>
        }
      </TableBody>
      <TableFooter>
        
      </TableFooter>
    </Table>
    {!isFetching && hasNextPage && <Button className='w-full' variant={"ghost"} onClick={() => fetchNextPage()}>See more <ChevronDown /></Button>}
      
      </CardContent>
      
    </Card>
    
  )
}

export default EventTable


const LoadingRow = () => { 
  return <TableRow key={"Loading"}>
  <TableCell><Skeleton className='w-full h-8'/></TableCell>
  <TableCell><Skeleton className='w-full h-8'/></TableCell>
  <TableCell><Skeleton className='w-full h-8'/></TableCell>
  <TableCell><Skeleton className='w-full h-8'/></TableCell>
  
</TableRow>
}