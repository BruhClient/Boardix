"use client "
import { getProjects } from "@/server/db/projects"
import { useInfiniteQuery } from "@tanstack/react-query"


const DEFAULT_FETCH_LIMIT =5
interface UseProjectsOptions {
    q: string | null
    filter: string | null, 
     
  }

export const useProjects = ({ q, filter}: UseProjectsOptions) => {
    const query = useInfiniteQuery({
      queryKey: ["Projects", filter, q],
      
      
      queryFn: async ({ pageParam = 0 }) => {
        
        const res = await fetch(`/api/projects?page=${pageParam}&take=${DEFAULT_FETCH_LIMIT}&q=${q}&filter=${filter}`)
        if (!res.ok) throw new Error("Failed to fetch projects")
        
        
    

        
        
        return res.json() ?? []
      },
      
      
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
      projects: query.data?.pages.flat() ?? [],
    }
  }