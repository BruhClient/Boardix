"use client"

import React, { useMemo } from 'react'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
import { colors } from '@/data/charts'
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from 'recharts'

const VerticalBarGraph = ({data , fieldType , sum , fill = false} : {data : any[] , fieldType : string , sum : string, fill? : boolean}) => {
    const chartConfig = useMemo(() => {
        const config = {}
        if (data) { 
            data.forEach((field,index) => {
                //@ts-ignore
                config[field[fieldType]] = { 
                  //@ts-ignore
                    label : field[fieldType], 
                    color: colors[index],
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
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={fieldType}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey={sum} radius={8} barSize={30}>
              
              {data?.map((entry, index) => {
                        //@ts-ignore
                        const config = chartConfig[entry[fieldType]];
                        return (
                        <Cell
                            key={`cell-${index}`}
                            fill={fill ? '#8884d8' : config?.color } // fallback color
                        />
                        );
              })}
            </Bar>
          </BarChart>
    </ChartContainer>
  )
}

export default VerticalBarGraph
