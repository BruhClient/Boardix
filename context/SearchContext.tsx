'use client'
import React, { createContext, useContext, useState } from 'react'

type SearchContextType = {
  searchParams: Record<string, string>
  setSearchParam: (key: string, value: string) => void
  deleteSearchParam: (key: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useState<Record<string, string>>({})

  const setSearchParam = (key: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [key]: value }))
  }

  const deleteSearchParam = (key: string) => {
    setSearchParams(prev => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
  }

  return (
    <SearchContext.Provider value={{ searchParams, setSearchParam, deleteSearchParam }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearchContext = () => {
  const context = useContext(SearchContext)
  if (!context) throw new Error('useSearchContext must be used within a SearchProvider')
  return context
}
