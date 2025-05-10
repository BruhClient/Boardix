"use client"


import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { projectIcons } from '@/data/project'
import { cn } from '@/lib/utils'
import { CreateProjectPayload, CreateProjectSchema } from '@/schema/create-project'
import { createProject } from '@/server/db/projects'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'

const CreateProjectForm = () => {
  const form = useForm(
    { 
      resolver : zodResolver(CreateProjectSchema), 
      defaultValues : { 
        name : "", 
        icon : "Prism",
        starred : false , 
      }
    }
  )
  const [isPending,startTransition] = useTransition()
  const queryClient = useQueryClient()
  const onSubmit = (values : CreateProjectPayload) => { 
    startTransition(() => { 
      createProject(values).then((data) => { 
        if (!data) { 
          toast.error("Something went wrong")
        } else { 
          toast.success("Project created")
          queryClient.invalidateQueries({queryKey : ["Projects"]})
          form.resetField("name")
          form.resetField("starred")
        }
      })
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
          <FormField
                        control={form.control}
                        name ="name"
                        render={({field}) => (
                            <FormItem >
                                
                                <FormControl>
                                    <Input {...field} type="text" placeholder="Project name"/>
                                    
                                </FormControl>
                            

                               <FormMessage />
                            </FormItem>

                            
                            
                        )}
            />

            <FormField
                        control={form.control}
                        name ="icon"
                        render={({field}) => (
                            <FormItem >
                                
                                <FormControl>
                                <div className='flex gap-2'>
                                    {
                                      projectIcons.map((projectIcon) => {
                                        const Icon = projectIcon.icon
                                        return <Button type='button' variant={field.value === projectIcon.name ? "default" : "outline"} size={"icon"} key={projectIcon.name} onClick={() => field.onChange(projectIcon.name)}>
                                          <Icon />
                                        </Button>
                                      })
                                    }
                                  </div>
                                                          
                                </FormControl>
                            

                               <FormMessage />
                            </FormItem>

                            
                            
                        )}
            />
            <div className='flex gap-2'>
              <Button type='submit' className='flex-1' disabled={isPending}>{isPending ? <span className='flex items-center gap-3'><ClipLoader size={15}/> Creating Project...</span>: "Create Project"}</Button>
              <FormField
                        control={form.control}
                        name ="starred"
                        render={({field}) => (
                            <FormItem >
                                
                                <FormControl>
                                
                                  <Button type='button' size={"icon"} variant={"outline"} onClick={() => field.onChange(!field.value)}><Star className={cn(field.value && "stroke-amber-400 fill-amber-400")} /></Button>               
                                </FormControl>
                            

                               <FormMessage />
                            </FormItem>

                            
                            
                        )}
            />
            </div>
            

            
      </form>
    </Form>
  )
}

export default CreateProjectForm
