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
import { capitalizeFirstLetter, getTimelineDescription } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import PieGraph from '@/components/PieGraph';
import VerticalBarGraph from '@/components/VerticalBarGraph';


async function fetchUserRankings({endpointId,filter,year,field,groupField , limit} : {endpointId : string,filter : string,year : string,field : string,groupField : string, limit? : number}){
 
 
  const res = await fetch(`${env.NEXT_PUBLIC_VERCEL_URL}/api/endpoint/rankings?endpointId=${endpointId}&filter=${filter}&year=${year}&field=${field}&groupField=${groupField}&limit=${limit}`)

  if (!res.ok) {
    throw new Error('Failed to fetch project stats');
  }

  const rawData: { top : any[] , total : number } = (await res.json())[0];

  console.log(rawData)
  const formattedTop = rawData.top.map((item) => { 
    
    const fieldValue = item[groupField]
    
      const format = {
      sum : item.sum ,
    }
    //@ts-ignore
    format[groupField] = fieldValue ? fieldValue : "NIL"
    return format
  })

  console.log("Formatted Field",formattedTop)



  return { 
    top : formattedTop, 
    total : rawData.total
  }
}




export default function Rankings({endpointId,groupField,field,title, chartType = "Bar", limit } : {endpointId : string , groupField : string , field : string,title? : string,chartType? : "Pie" | "Bar" , limit? : number}) {
  

  const {filter,year} = useDateFilter()
  const { data, isLoading, error } = useQuery({
    queryKey: ['Rankings',endpointId,groupField,field,limit,filter,year],
    queryFn: () => fetchUserRankings({endpointId,filter,year,field,groupField,limit}),
  });

 
 
  
  if (error) return <p>Failed to load chart</p>;
  
  console.log(data)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ? title : `Top ${capitalizeFirstLetter(groupField)} by ${field}`}</CardTitle>
        <CardDescription>{getTimelineDescription(filter)}</CardDescription>
      </CardHeader>
      <CardContent className='h-full w-full  flex justify-center items-center min-h-[300px]'>
      {!isLoading ? ((data && data.top?.length > 0) ? <div className='w-full h-full'>
                {chartType === "Bar" ?  <VerticalBarGraph data={data.top} fieldType={groupField} sum={"sum"}/> : <PieGraph data={data.top} fieldType={groupField} sum={"sum"}/>
                }
              </div> : <div>Unsufficient data</div>) : <Skeleton className='w-full h-full'/>}
        
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className='flex gap-1'>
          There are a total of {isLoading ? <Skeleton className='w-6 h-full'/>: <span className='font-bold'>{data?.total ?? 0}</span>} distinct users
        </div>
      </CardFooter>
  
    </Card>
  );
}
