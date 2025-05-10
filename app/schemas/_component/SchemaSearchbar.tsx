"use client"
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const SchemaSearchbar = () => {
  const [input,setInput] = useState("")
  const debounceValue = useDebounce(input,300)
  const searchParams = useSearchParams()
  const router = useRouter()
  useEffect(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (debounceValue ) {
          
        params.set("q", debounceValue)
        
        
        
      } else {
        params.delete("q")
      }
      router.push(`?${params.toString()}`)
    }, [debounceValue])
  return (
    <div className="relative flex items-center max-w-2xl w-full">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search schema by name"
            className="pl-10"
            />
    </div>
  )
}

export default SchemaSearchbar
