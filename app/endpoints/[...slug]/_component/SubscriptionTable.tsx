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
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useSearchContext } from '@/context/SearchContext'
import ViewButton from './ViewButton'
import { useSubscriptionSchema } from '@/hooks/use-subscription-schema'



const SubscriptionTable = ({id} : {id : string}) => {
    const {searchParams} = useSearchContext()
    
    const {subscriptions,fetchNextPage,hasNextPage,isFetching} = useSubscriptionSchema({id,type : searchParams["type"] ?? "" ,userId : searchParams["userId"] ?? "" }) 


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
          
          <TableHead>User Id</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead >Amount</TableHead>
          <TableHead></TableHead>
          
          
        </TableRow>
      </TableHeader>
      <TableBody >
        {
          subscriptions.map((subscription) => { 
            
            
            return <TableRow key={subscription.id}>
            <TableCell className="font-medium">{subscription.userId}</TableCell>
            <TableCell>{format(subscription.createdAt,"EEEE, MMMM d, yyyy 'at' h:mm a")}</TableCell>
            <TableCell>{subscription.type}</TableCell>
            <TableCell>$ {subscription.amount}</TableCell>
            <TableCell className='text-right'><ViewButton id={subscription.id} schema='Payment' fields={subscription} endpointId={id}/></TableCell>
         
            
            
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

export default SubscriptionTable

const LoadingRow = () => { 
    return <TableRow key={"Loading"}>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    
  </TableRow>
}
