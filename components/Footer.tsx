import React from 'react'
import { Button } from './ui/button'
import { Facebook, Github, Instagram, Linkedin, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { SiTiktok } from 'react-icons/si'

const icons = [
  {
    name : "Instagram",
    href : "/", 
    icon : Instagram
  },
  {
    name : "Facebook",
    href : "/", 
    icon : Facebook
  },
  {
    name : "LinkedIn",
    href : "/", 
    icon : Linkedin
  },
  {
    name : "TikTok",
    href : "/", 
    icon : SiTiktok
  },
  {
    name : "GitHub",
    href : "/", 
    icon : Github
  }
]
const Footer = () => {
  return (
    <div className='h-[100px] w-full flex items-center justify-between px-12 bg-background '>
      <div className='text-muted-foreground'>
        Boardix@2025
      </div>
      <div className='flex gap-2'>
        {icons.map((item) => { 
          const Icon = item.icon as LucideIcon
          return <Button key={item.name} size={"icon"} variant={"outline"} asChild>
            <Link href={item.href}>
              <Icon />
            </Link>
            
          </Button>
        })} 
      </div>
    </div>
  )
}

export default Footer
