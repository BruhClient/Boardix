"use client"
import React, { useMemo } from 'react'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { colors } from '@/data/charts';
import { Cell, Pie, PieChart } from 'recharts';

const PieGraph = ({data , fieldType , sum} : {data : any[] , fieldType : string , sum : string}) => {
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
    <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px] w-full"
          >
            <PieChart>
              <Pie data={data} dataKey={sum} nameKey={fieldType}>
              {data?.map((entry, index) => {
                    //@ts-ignore
                    const config = chartConfig[entry[fieldType]];
                    return (
                    <Cell
                        key={`cell-${index}`}
                        fill={config?.color || '#8884d8'} // fallback color
                    />
                    );
                })}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend
                content={<ChartLegendContent nameKey={fieldType} />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
                
            </PieChart>
    </ChartContainer>
  )
}

export default PieGraph
