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
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { capitalizeFirstLetter, getTimelineDescription } from '@/lib/utils';
import BarGraph from '@/components/BarGraph';



async function fetchProjectRegions({endpointId,filter,year,fieldType} : {endpointId : string,filter : string,year : string,fieldType: string}) {
 
 
  const res = await fetch(`${env.NEXT_PUBLIC_VERCEL_URL}/api/endpoint/percentage?endpointId=${endpointId}&filter=${filter}&year=${year}&field=${fieldType}`)

  if (!res.ok) {
    throw new Error('Failed to fetch project stats');
  }

  const rawData: { region: string; count: number }[] = await res.json();
  
  return rawData
}




export default function ApiBarGraph({endpointId , fieldType,title } : {endpointId : string,fieldType : string,title? : string}) {
  

  const {filter,year} = useDateFilter()
  const { data, isLoading, error } = useQuery({
    queryKey: [fieldType,endpointId,filter,year],
    queryFn: () => fetchProjectRegions({endpointId,filter,year,fieldType}),
  });

  
  if (error) return <p>Failed to load chart</p>;

 

 

  const percentageOfNIL = useMemo(() => {
    if (!data || data.length === 0) return 0
    //@ts-ignore
    const nilCount = data.find((item) => item[fieldType] === "NIL" )?.count ?? 0

    const totalCount = data.reduce((acc,item) => {
        return acc + item.count
    },0)

    


  
    return ((nilCount/totalCount)  * 100).toFixed(2)
  },[data])

  if (error) { 
    return <div>Something went wrong</div>
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ? title : `By ${capitalizeFirstLetter(fieldType)}`}</CardTitle>
        <CardDescription>{getTimelineDescription(filter)}</CardDescription>
      </CardHeader>
      <CardContent className='h-full w-full flex items-center min-h-[300px] justify-center'>
      {!isLoading ? ((data && data.length > 0) ? <BarGraph data={data} fieldType={fieldType} sum={"count"}/> : <div>Unsufficient data</div>) : <Skeleton className='w-full h-full'/>}
      
    
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {isLoading ? <Skeleton className='h-full w-12'/>:<span className='font-bold'>{percentageOfNIL}%</span>} of the calls were undocumented
        </div>
        <div className="leading-none text-muted-foreground">
          Statistics as of {getTimelineDescription(filter)}
        </div>
      </CardFooter>
      
  
    </Card>
  );
}
