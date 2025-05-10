'use client'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { useSearchContext } from '@/context/SearchContext'

const DataSearchBar = ({ schema, field }: { schema: string; field: string }) => {
  const { searchParams, setSearchParam, deleteSearchParam } = useSearchContext()

  const [input, setInput] = useState(searchParams[field] || '')
  const debouncedInput = useDebounce(input, 200)

  useEffect(() => {
    if (debouncedInput) {
      setSearchParam(field, debouncedInput)
    } else {
      deleteSearchParam(field)
    }
  }, [debouncedInput])

  return (
    <div className="relative flex items-center max-w-2xl w-full">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Search ${schema} by ${field}`}
        value={input}
        className="pl-10"
      />
    </div>
  )
}

export default DataSearchBar
