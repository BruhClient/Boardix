'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDateFilter } from '@/context/DateFilterContext';
import { getYearsSinceDate } from '@/lib/utils';


export function FilterSelect({projectStart} : {projectStart : Date}) {
  const { filter, setFilter , year, setYear } = useDateFilter();


  const dateStart = new Date(projectStart)
  const dates = getYearsSinceDate(dateStart)
  return (
    <div className='flex gap-2'>
      <Select value={filter} defaultValue='month' onValueChange={setFilter}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="last-month">Last Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectContent>
      </Select>

      <Select value={year} defaultValue={year } onValueChange={setYear}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          { 
            dates.map((date) => <SelectItem key={date} value={`${date}`}>{date}</SelectItem>)
          }
        
        </SelectContent>
      </Select>
    </div>
    
  );
}
