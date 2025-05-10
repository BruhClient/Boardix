"use client "
import { getEndpoints } from "@/server/db/endpoints"
import { useInfiniteQuery } from "@tanstack/react-query"


const DEFAULT_FETCH_LIMIT =5
interface UseEventsOptions {
    id: string ,
    productName : string, 
    userId : string
     
}

export const usePaymentSchema = ({id, productName , userId}: UseEventsOptions) => {
    const query = useInfiniteQuery({
      queryKey: ["paymentSchema",id, productName,userId],
      
      
      queryFn: async ({ pageParam = 0 }) => {
        
        const res = await fetch(`/api/schema/paymentSchema?id=${id}&take=${DEFAULT_FETCH_LIMIT}&page=${pageParam}&productName=${productName}&userId=${userId}`)
        if (!res.ok) throw new Error("Failed to fetch Payment Schema")
        
        
    

        
        
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
      payments: query.data?.pages.flat() ?? [],
    }
  }