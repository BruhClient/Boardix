import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const Header = () => {
  return (
    <div className='w-full h-[90vh] flex  justify-center items-center flex-col gap-4 px-3'>
      <h1 className='text-4xl sm:text-5xl font-bold max-w-[600px] text-balance w-full text-center'>
        Seamlessly organise your <span className='text-primary'>research</span> and <span className='text-primary'>analytics</span>.
      </h1>
      <p className='max-w-[500px] text-center text-xl'>
        Boardix is a anayltical tool that uses api calls to track exactly what you want.
      </p>
      <div className='flex gap-2'>
        <Button asChild><Link href={"/signin"}>Create an Account</Link></Button>
        <Button variant={"ghost"} asChild><Link href={"/signin"}>Learn More <ArrowRight /></Link></Button>
      </div>
    </div>
  )
}

export default Header
