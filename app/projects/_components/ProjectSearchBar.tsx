"use client"
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'
const ProjectSearchBar = () => {
    const router = useRouter()
  const searchParams = useSearchParams()

  const [input, setInput] = useState(searchParams.get("q") || "")
  const debouncedInput = useDebounce(input, 200)

  const [filter, setFilter] = useState(searchParams.get("filter") || "all")
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedInput) {
      params.set("q", debouncedInput)
      
      
      
    } else {
      params.delete("q")
    }
    router.push(`?${params.toString()}`)
  }, [debouncedInput])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (filter && filter !== "all" ) {
        
      params.set("filter", filter)
      
      
      
    } else {
      params.delete("filter")
    }
    router.push(`?${params.toString()}`)
  }, [filter])

  return (
    <div className='w-full flex gap-2'>
        <div className="relative flex items-center max-w-2xl w-full">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search project by name"
            className="pl-10"
            />
        </div>
        <div>
        <Select defaultValue='all' onValueChange={(value) => setFilter(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filters</SelectLabel>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="starred">Starred</SelectItem>
          <SelectItem value="recent">Recent</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
        </div>
    </div>
    
      
   
  )
}

export default ProjectSearchBar
