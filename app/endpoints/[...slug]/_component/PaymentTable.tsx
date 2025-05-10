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
import { usePaymentSchema } from '@/hooks/use-payment-schema'
import { useSearchContext } from '@/context/SearchContext'
import ViewButton from './ViewButton'



const PaymentTable = ({id} : {id : string}) => {
    const {searchParams} = useSearchContext()
    
    const {payments,fetchNextPage,hasNextPage,isFetching} = usePaymentSchema({id,productName : searchParams["productName"] ?? "" ,userId : searchParams["userId"] ?? "" }) 


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
          <TableHead>Product Name</TableHead>
          <TableHead >Amount</TableHead>
          <TableHead></TableHead>
          
          
        </TableRow>
      </TableHeader>
      <TableBody >
        {
          payments.map((payment) => { 
            
            
            return <TableRow key={payment.id}>
            <TableCell className="font-medium">{payment.userId}</TableCell>
            <TableCell>{format(payment.createdAt,"EEEE, MMMM d, yyyy 'at' h:mm a")}</TableCell>
            <TableCell>{payment.productName}</TableCell>
            <TableCell>$ {payment.amount}</TableCell>
            <TableCell className='text-right'><ViewButton id={payment.id} schema='Payment' fields={payment} endpointId={id}/></TableCell>
         
            
            
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

export default PaymentTable

const LoadingRow = () => { 
    return <TableRow key={"Loading"}>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    
  </TableRow>
}
