'use client';

import {
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  Line,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { env } from '@/data/env/client';
import { format } from 'date-fns';

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
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
interface DataPoint {
  date: string;
  calls: number;
}



async function fetchProjectStats({endpointId,filter,year} : {endpointId : string,filter : string,year : string}): Promise<DataPoint[]> {
 
 
  const res = await fetch(`${env.NEXT_PUBLIC_VERCEL_URL}/api/endpoint/generaloverview?endpointId=${endpointId}&filter=${filter}&year=${year}`)

  if (!res.ok) {
    throw new Error('Failed to fetch project stats');
  }

  const rawData: { date: string; calls: number }[] = await res.json();

  return rawData
}




export default function GeneralOverview({endpointId } : {endpointId : string}) {
  

  const {filter,year} = useDateFilter()
  const { data, isLoading, error } = useQuery({
    queryKey: ['General Overview',endpointId,filter,year],
    queryFn: () => fetchProjectStats({endpointId,filter,year}),
  });

  const total_calls = useMemo(() => {
    let count = 0 

  
    for (const item in data) { 
      //@ts-ignore
      count += data[item].calls
    }
    return count
  },[data])

  
  if (error) return <p>Failed to load chart</p>;
  
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Overview</CardTitle>
        <CardDescription>{getTimelineDescription(filter)}</CardDescription>
      </CardHeader>
      <CardContent className='h-full flex justify-center items-center'>
        {
          isLoading ? <Skeleton className='w-full h-full min-h-[300px]'/>: <ResponsiveContainer width="100%" height={300}>
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
              dataKey={"calls"}
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
          You made a total of {isLoading ? <Skeleton className='h-full w-12'/>:<span className='font-bold'>{total_calls}</span>} calls to this endpoint 
        </div>
        <div className="leading-none text-muted-foreground">
          Showing all api calls during {getTimelineDescription(filter)}
        </div>
      </CardFooter>
  
    </Card>
  );
}
