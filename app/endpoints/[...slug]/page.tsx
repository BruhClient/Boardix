
import { getEndpoint } from '@/server/db/endpoints'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'
import React from 'react'
import EditEndpointForm from '../_component/EditEndpointForm'
import BackButton from '@/components/BackButton'
import { FilterSelect } from '../_component/FilterSelectButton'
import GeneralOverview from '../_component/GeneralOverview'
import PieChartComponent from '../_component/ApiPieChart'
import AmountChart from '../_component/AmountChart'
import EnabledToggle from '../_component/EnabledToggle'
import BarChartComponent from '../_component/ApiBarGraph'
import DataSearchBar from '../_component/Searchbar'
import EventTable from './_component/EventTable'
import PaymentTable from './_component/PaymentTable'
import UserTable from './_component/UserTable'
import Rankings from '../_component/Rankings'
import SubscriptionTable from './_component/SubscriptionTable'


const EndpointPage = async ({params} : {params : Promise<{slug : string}>}) => {
    const slug = (await params).slug[0]
    const endpoint = await getEndpoint(slug)
    if (!endpoint) { 
      redirect("/projects")
    }

    
    
  return (
    (
      <div className='lg:px-10 px-5 pt-3 flex flex-col  gap-3 pb-10'>

          <div className='flex w-full items-center justify-between'>
            
            <div className='flex gap-2'>
            <BackButton />
              <div className='flex flex-col gap-1'>

              <div className='text-3xl font-bold break-all'>
                  {endpoint.name}
              </div>
              <div className='text-muted-foreground text-sm'>
                  {format(endpoint.createdAt,"EEEE, MMMM d, yyyy 'at' h:mm a")}
              </div>

              </div>
              
            </div>
              <div className='flex items-center gap-2 flex-col md:flex-row'>
                <EnabledToggle id={endpoint.id} enabled={endpoint.enabled} projectId={endpoint.projectId}/>
                <EditEndpointForm id={slug} name={endpoint.name} enabled={endpoint.enabled} schemaName={endpoint.schema}/>
              </div>
              
          </div>
          
          
        <FilterSelect projectStart={endpoint.createdAt}/>
        
           
            <div className='w-full grid grid-cols-1 gap-2 lg:grid-cols-3'>
              
              <GeneralOverview endpointId={endpoint.id} />
              <PieChartComponent endpointId={endpoint.id} fieldType='region' title='Api Calls By Region'/>
              
              {endpoint.schema === "Payment"  && <>
                <AmountChart endpointId={endpoint.id}/>
                
                <Rankings endpointId={endpoint.id} groupField='region' field='amount' title='Regions by Sales Amount' chartType='Pie'/>
                <Rankings endpointId={endpoint.id} groupField='userId' field='amount' title='Top Users by Sales Amount' limit={5}/>
                <Rankings endpointId={endpoint.id} groupField='productName' field='amount' title='Product Names by amount' chartType='Pie'/>
              </>}
              {endpoint.schema === "User"  && <>
            
                <PieChartComponent endpointId={endpoint.id} fieldType='tier'/>
          
                <BarChartComponent endpointId={endpoint.id} fieldType='role'/>
                <PieChartComponent endpointId={endpoint.id} fieldType='authProvider'/>
              
              </>}
              {endpoint.schema === "Event"  && <>
            
              <PieChartComponent endpointId={endpoint.id} fieldType='eventType'/>
          
            </>}

            {endpoint.schema === "Subscription"  && <>
            
            <PieChartComponent endpointId={endpoint.id} fieldType='type' title='By Subscription Type'/>
        
          </>}
              
       
               
            </div>

            <div className='flex gap-2 flex-col'>
              {
                endpoint.schema === "Event" && <>
                <DataSearchBar schema='event' field='eventType'/>
                <DataSearchBar schema='event' field='userId'/>
                <EventTable id={endpoint.id} />
                </>
              }
              {
                endpoint.schema === "Payment" && <>
                
                <DataSearchBar schema='payment' field='productName'/>
                <DataSearchBar schema='payment' field='userId'/>
                <PaymentTable id={endpoint.id}/>
             
                </>
              }
              {
                endpoint.schema === "User" && <>
                
                <DataSearchBar schema='user' field='userId'/>
                <DataSearchBar schema='user' field='name'/>
                <DataSearchBar schema='user' field='email'/>
                <UserTable id={endpoint.id}/>
             
                </>
              }
              {
                endpoint.schema === "Subscription" && <>
                
                <DataSearchBar schema='subscription' field='userId'/>
                
                <SubscriptionTable id={endpoint.id}/>
             
                </>
              }

            </div>
            
            
           
            
            
       
        
        
          
          
          
          
  
          
          
          
      </div>
    )
  )
}

export default EndpointPage
