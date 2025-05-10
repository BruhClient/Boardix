"use client"
import React from 'react'
import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const BackButton = () => {
    const router = useRouter()
  return (
    <Button size={"icon"} variant={"ghost"} onClick={() => router.back()}>
      <ChevronLeft />
    </Button>
  )
}

export default BackButton
