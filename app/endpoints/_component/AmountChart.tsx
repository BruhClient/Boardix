"use client"

import { useDateFilter } from '@/context/DateFilterContext';
import { env } from '@/data/env/client';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { getTimelineDescription } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
async function fetchProjectAmount({endpointId,filter,year} : {endpointId : string,filter : string,year : string}) {
 
 
  const res = await fetch(`${env.NEXT_PUBLIC_VERCEL_URL}/api/endpoint/amount?endpointId=${endpointId}&filter=${filter}&year=${year}`)

  if (!res.ok) {
    throw new Error('Failed to fetch project stats');
  }

  const rawData = await res.json();

  
  return rawData as {date : string , amount : number}[]
}

const AmountChart = ({endpointId} : {endpointId : string}) => {
    const {filter,year} = useDateFilter()
  const { data, isLoading, error } = useQuery({
    queryKey: ['Amount',endpointId,filter,year],
    queryFn: () => fetchProjectAmount({endpointId,filter,year}),
  });

  const totalAmount = useMemo(() => {

    
    const total = data?.reduce((acc, entry) => {
        return acc + entry.amount
    },0);
   
    return total
  },[data])

  const highestAmount = useMemo(() => {
    
    if (data?.length === 0) return null;
    

    return data?.reduce((max, entry) =>
    entry.amount > max.amount ? entry : max
    );
   
   
  },[data])

  
  if (error) return <p>Failed to load chart</p>;
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Amount</CardTitle>
        <CardDescription>{getTimelineDescription(filter)}</CardDescription>
      </CardHeader>
      <CardContent className='h-full flex justify-center items-center'>
    {
              isLoading ? <Skeleton className='w-full h-full min-h-[300px]'/>: 
              <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                  
                />
                <Tooltip
                  labelClassName='text-black'
                />
                <Line
                  type="monotone"
                  dataKey={"amount"}
                  stroke={"#6366F1"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
          </ResponsiveContainer>
    }
    
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total of {isLoading ? <Skeleton className='h-full w-12'/>:<span className='font-bold'>${totalAmount}</span>} in the {filter} of {getTimelineDescription(filter)}
        </div>
        <div className="leading-none text-muted-foreground flex gap-1">
          Highest amount recorded was on {highestAmount ? <span>{highestAmount.date} {getTimelineDescription(filter)}</span> : <Skeleton  className='w-12 h-full'/>} at {highestAmount ? <span className='font-bold'>${highestAmount.amount}</span> : <Skeleton  className='w-12 h-full'/>}
        </div>
      </CardFooter>
      
  
    </Card>
  )
}

export default AmountChart
