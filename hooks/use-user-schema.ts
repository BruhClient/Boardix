"use client "
import { getEndpoints } from "@/server/db/endpoints"
import { useInfiniteQuery } from "@tanstack/react-query"


const DEFAULT_FETCH_LIMIT =5
interface UseEventsOptions {
    id: string ,
    name : string, 
    userId : string, 
    email : string,
     
}

export const useUserSchema = ({id, name , email,userId}: UseEventsOptions) => {
    const query = useInfiniteQuery({
      queryKey: ["userSchema",id, userId,name,email],
      
      
      queryFn: async ({ pageParam = 0 }) => {
        
        const res = await fetch(`/api/schema/userSchema?id=${id}&take=${DEFAULT_FETCH_LIMIT}&page=${pageParam}&email=${email}&userId=${userId}&name=${name}`)
        if (!res.ok) throw new Error("Failed to fetch User Schema")
        
        
    

        
        
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
      users: query.data?.pages.flat() ?? [],
    }
  }