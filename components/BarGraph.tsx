"use client"

import React, { useMemo } from 'react'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
import { colors } from '@/data/charts'
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts'

const BarGraph = ({data , fieldType , sum} : {data : any[] , fieldType : string , sum : string}) => {
    const chartConfig = useMemo(() => {
        const config = {}
        if (data) { 
            data.forEach((field,index) => {
                //@ts-ignore
                config[field[fieldType]] = { 
                  //@ts-ignore
                    label : field[fieldType], 
                    color: colors[index % colors.length],
                }
            })
        }
      
        return config satisfies ChartConfig
    },[data])
    
  return (
    <ChartContainer config={chartConfig} className='w-full h-full'>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey={fieldType}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                //@ts-ignore
                chartConfig[value as keyof typeof chartConfig]?.label
              }
              
            />
            <XAxis dataKey={sum} type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey={sum} layout="vertical" radius={5} barSize={20}>
            {data?.map((entry, index) => (
                //@ts-ignore
                <Cell key={`cell-${index}`}  fill={chartConfig[entry[fieldType]]?.color || '#ccc'} />
            ))}
            </Bar>
          </BarChart>
    </ChartContainer>
  )
}

export default BarGraph
