"use client"

import React from 'react'
import Logo from './Logo'
import { Button } from './ui/button'
import Link from 'next/link'
import useSessionUser from '@/hooks/use-session-user'
import UserProfile from './auth/UserProfile'
import { ChartColumnIncreasing, Home, Network } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'


const navbarLinks = [
    {
        name : "Home", 
        icon : Home, 
        href : "/dashboard"
    },
    {
        name : "Projects", 
        icon : ChartColumnIncreasing, 
        href : "/projects"
    },
    {
        name : "Schemas", 
        icon : Network, 
        href : "/schemas"
    }
]
const Navbar = () => {

    const user = useSessionUser()
    const pathname = usePathname()
  return (
    <nav className='flex w-full justify-between py-3 px-4 items-center flex-wrap'>
      <Logo />


        {user && <div className='sm:flex gap-1 hidden'>
            {navbarLinks.map((link) => <Button key={link.name} variant={"link"} className={cn(pathname === link.href && "text-primary")} asChild><Link href={link.href}><link.icon />{link.name}</Link></Button>)}
        </div>}
      {!user ? <div className='flex gap-2'>
        <Button asChild><Link href={"/signin"}>Get Started</Link></Button>
        <Button variant={"outline"} asChild><Link href={"/signup"}>Sign up</Link></Button>
      </div> : <UserProfile />}
         {user && <div className='flex sm:hidden justify-center pt-3 flex-1 gap-1'>
            {navbarLinks.map((link) => <Button key={link.name} variant={"link"} className={cn(pathname === link.href && "text-primary")} asChild><Link href={link.href}><link.icon />{link.name}</Link></Button>)}
        </div>}
    </nav>
  )
}

export default Navbar
