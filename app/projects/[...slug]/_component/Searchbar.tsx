"use client"
import { Input } from '@/components/ui/input'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { schemaNames } from '@/data/schemas'
import { useDebounce } from '@/hooks/use-debounce'
import { Select } from '@radix-ui/react-select'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Searchbar = () => {
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
    <div className='flex gap-2 flex-wrap'>
      <div className="relative flex items-center max-w-2xl w-full">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search project by name"
            className="pl-10"
            />
    </div>
      <Select value={filter} onValueChange={(value) => setFilter(value)}>
                                              <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select a schema" />
                                              </SelectTrigger>
                                              <SelectContent>
                                              <SelectItem value={"all"}>{"All"}</SelectItem>
                                                {schemaNames.map((name) => <SelectItem value={name} key={name}>{name}</SelectItem>)}
                                              </SelectContent>
                                            </Select>
    </div>
  )
}

export default Searchbar
