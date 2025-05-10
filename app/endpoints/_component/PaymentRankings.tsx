'use client';

import { useQuery } from '@tanstack/react-query';
import { env } from '@/data/env/client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDateFilter } from '@/context/DateFilterContext';
import { getTimelineDescription } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';




async function fetchUserRankings({endpointId,filter,year} : {endpointId : string,filter : string,year : string}){
 
 
  const res = await fetch(`${env.NEXT_PUBLIC_VERCEL_URL}/api/endpoint/rankings?endpointId=${endpointId}&filter=${filter}&year=${year}&field=amount&groupField=region`)

  if (!res.ok) {
    throw new Error('Failed to fetch project stats');
  }

  const rawData: { topUsers : {userId : string , totalAmount : number}[] , totalUsers : number } = (await res.json())[0];
  console.log("RANKINGS",rawData)
  return rawData
}




export default function PaymentRankings({endpointId } : {endpointId : string}) {
  

  const {filter,year} = useDateFilter()
  const { data, isLoading, error } = useQuery({
    queryKey: ['Payment Rankings',endpointId,filter,year],
    queryFn: () => fetchUserRankings({endpointId,filter,year}),
  });

  
 
  
  if (error) return <p>Failed to load chart</p>;
  
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Users</CardTitle>
        <CardDescription>{getTimelineDescription(filter)}</CardDescription>
      </CardHeader>
      <CardContent className='h-full'>
        {
          isLoading ? <Skeleton className='w-full h-full min-h-[300px]'/> : <div className='flex-col flex gap-2'>
            {data?.topUsers?.map(({userId,totalAmount},index) => { 
              return <div key={userId} className='flex gap-4 items-center bg-muted py-2 px-4 rounded-lg'>
                <div className='font-bold'>
                  {index + 1}.
                </div>
             
                <div className='font-bold'>
                    {userId}
                </div>
                <div className='text-muted-foreground flex-1 flex justify-end'>
                    $ {totalAmount}
                </div>
              
                
                
              </div>
            })}
          </div>
        }
        
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className='flex gap-1'>
          There are a total of {isLoading ? <Skeleton className='w-6 h-full'/>: <span className='font-bold'>{data?.totalUsers ?? 0}</span>} distinct users
        </div>
      </CardFooter>
  
    </Card>
  );
}
