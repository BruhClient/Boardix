"use client "
import { getEndpoints } from "@/server/db/endpoints"
import { useInfiniteQuery } from "@tanstack/react-query"


const DEFAULT_FETCH_LIMIT =5
interface UseEventsOptions {
    id: string ,
    type : string,
    userId : string
     
}

export const useSubscriptionSchema = ({id, type , userId}: UseEventsOptions) => {
    const query = useInfiniteQuery({
      queryKey: ["subscriptionSchema",id, type,userId],
      
      
      queryFn: async ({ pageParam = 0 }) => {
        
        const res = await fetch(`/api/schema/subscriptionSchema?id=${id}&take=${DEFAULT_FETCH_LIMIT}&page=${pageParam}&type=${type}&userId=${userId}`)
        if (!res.ok) throw new Error("Failed to fetch Subscription Schema")
        
        
    

        
        
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
      subscriptions: query.data?.pages.flat() ?? [],
    }
  }