"use client "
import { useInfiniteQuery } from "@tanstack/react-query"


const DEFAULT_FETCH_LIMIT =5
interface UseProjectsOptions {
    q: string | null
    filter: string | null, 
    id : string
     
}

export const useEndpoints = ({id, q, filter}: UseProjectsOptions) => {
    const query = useInfiniteQuery({
      queryKey: ["Endpoints",id, filter, q],
      
      
      queryFn: async ({ pageParam = 0 }) => {
        
        const res = await fetch(`/api/endpoints/project?id=${id}&take=${DEFAULT_FETCH_LIMIT}&page=${pageParam}&q=${q}&filter=${filter}`)
        if (!res.ok) throw new Error("Failed to fetch Endpoints")
        
        
    

        
        
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
      endpoints: query.data?.pages.flat() ?? [],
    }
  }