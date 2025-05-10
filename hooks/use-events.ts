"use client "
import { getEndpoints } from "@/server/db/endpoints"
import { useInfiniteQuery } from "@tanstack/react-query"


const DEFAULT_FETCH_LIMIT =5
interface UseEventsOptions {
    id: string ,
    eventType : string, 
    userId : string
     
}

export const useEvents = ({id, eventType , userId}: UseEventsOptions) => {
    const query = useInfiniteQuery({
      queryKey: ["eventSchema",id, eventType,userId],
      
      
      queryFn: async ({ pageParam = 0 }) => {
        
        const res = await fetch(`/api/schema/events?id=${id}&take=${DEFAULT_FETCH_LIMIT}&page=${pageParam}&eventType=${eventType}&userId=${userId}`)
        if (!res.ok) throw new Error("Failed to fetch Events")
        
        
    

        
        
        return res.json() ?? []
      },
      staleTime : 120000 ,
      
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {

       
        if (lastPage.length < DEFAULT_FETCH_LIMIT) {
          return undefined // No more pages
        }
        return lastPageParam + 1
      },
      initialPageParam: 0,
     
     
     
    })
  
    return {
      ...query,
      events: query.data?.pages.flat() ?? [],
    }
  }