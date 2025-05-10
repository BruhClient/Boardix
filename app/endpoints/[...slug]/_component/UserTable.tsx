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
import { useUserSchema } from '@/hooks/use-user-schema'
import ViewButton from './ViewButton'


const UserTable = ({id} : {id : string}) => {
    const {searchParams} = useSearchContext()
    
    const {users,fetchNextPage,hasNextPage,isFetching} = useUserSchema({id,name : searchParams["name"] ?? "" ,userId : searchParams["userId"] ?? "", email : searchParams["email"] ?? "" }) 


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
          <TableHead>Name</TableHead>
          <TableHead >Email</TableHead>
          <TableHead></TableHead>
          
          
        </TableRow>
      </TableHeader>
      <TableBody >
        {
          users.map((user) => { 
            
            
            return <TableRow key={user.id}>
            <TableCell className="font-medium">{user.userId}</TableCell>
            <TableCell>{format(user.createdAt,"EEEE, MMMM d, yyyy 'at' h:mm a")}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className='text-right'><ViewButton id={user.id} schema='User' fields={user} endpointId={id}/></TableCell>
         
            
            
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

export default UserTable

const LoadingRow = () => { 
    return <TableRow key={"Loading"}>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    <TableCell><Skeleton className='w-full h-8'/></TableCell>
    
  </TableRow>
}
