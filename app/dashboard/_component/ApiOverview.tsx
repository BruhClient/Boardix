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
import VerticalBarGraph from '@/components/VerticalBarGraph';
import { Skeleton } from '@/components/ui/skeleton';
import { getTimelineDescription } from '@/lib/utils';


async function fetchApiUsage(){
 
 
  const res = await fetch(`${env.NEXT_PUBLIC_VERCEL_URL}/api/endpoints/overview`)
  if (!res.ok) {
    throw new Error('Failed to fetch project stats');
  }



  const rawData = await res.json() as {month : string , user_count : string , event_count : string ,payment_count : string,subscription_count : string}[];

  const countTypes = ["total_count","user_count","event_count","payment_count", "subscription_count" ]

  const result = {}
  for (const i in countTypes) { 
    const type = countTypes[i]
    const data = {
      "Jan": 0,
      "Feb": 0,
      "Mar": 0,
      "Apr": 0,
      "May": 0,
      "Jun": 0,
      "Jul": 0,
      "Aug": 0,
      "Sep": 0,
      "Oct": 0,
      "Nov": 0,
      "Dec": 0
    }
  
    console.log(rawData)
    rawData.forEach(({month,user_count,event_count,payment_count,subscription_count}) => { 
      
      if (type === "total_count") { 
        const total_count = parseInt(user_count) + parseInt(event_count) + parseInt(payment_count) + parseInt(subscription_count)
        //@ts-ignore
        data[month] = total_count
      } else { 
        switch (type) { 
          case "user_count" : { 
          
          //@ts-ignore
          data[month] = parseInt(user_count)
            break
          }
          case "event_count" : { 
            //@ts-ignore
          data[month] = parseInt(event_count)
            break
          }
          case "payment_count" : { 
            //@ts-ignore
          data[month] = parseInt(payment_count)
            break
          }
          case "subscription_count" : { 
            //@ts-ignore
          data[month] = parseInt(subscription_count)
            break
          }
        }
      }
      
    } )
  
    const finalized_data : {month : string , count : number}[] = []
  
    for (const key in data) {    
      //@ts-ignore
      finalized_data.push({month : key , count : data[key]})
    }
    //@ts-ignore
    result[type] = finalized_data

  }
  
  
 



  return result as { total_count : any , user_count : any , payment_count : any , event_count : any, subscription_count : any}
}




export default function ApiOverview({userId} : {userId : string}) {
  

  const { data, isLoading, error } = useQuery({
    queryKey: ["Api Overview", userId],
    queryFn: () => fetchApiUsage(),
  });

  
  
  

  
  console.log(data)
  
 
  
  if (error) return <p>Failed to load chart</p>;
  
 
  return (
    <>
    <ApiChart isLoading={isLoading} data={data?.total_count} title='All Api Data' description='Showing all api data stored regardless of schema'/>
    <ApiChart isLoading={isLoading} data={data?.user_count} title='User Schema Data' description='Showing all api data stored for User Schema'/>
    <ApiChart isLoading={isLoading} data={data?.payment_count} title='Payment Schema Data' description='Showing all api data stored for Payment Schema'/>
    <ApiChart isLoading={isLoading} data={data?.event_count} title='Event Schema Data'description='Showing all api data stored for Event Schema'/>
    <ApiChart isLoading={isLoading} data={data?.subscription_count} title='Subscription Schema Data'description='Showing all api data stored for Subscription Schema'/>
    </>
    
    
  );
}

const ApiChart = ({isLoading ,data, title,description} : {isLoading : boolean , data : any[],title : string,description : string}) => { 

  return <Card className='w-full'>
    <CardHeader>
      <CardTitle>
        {title}
      </CardTitle>
      <CardDescription>
        {getTimelineDescription("month")}
      </CardDescription>
    </CardHeader>
  <CardContent>
    {
      isLoading || !data ? <Skeleton className='w-full min-h-[300px]'/> : <VerticalBarGraph data={data} fieldType='month' sum='count'/>
    }
  </CardContent>
  <CardFooter>
    <div className='text-sm text-muted-foreground'>
      {description}
    </div>
    
  </CardFooter>
</Card>
}
