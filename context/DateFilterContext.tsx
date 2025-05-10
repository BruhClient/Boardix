'use client';

import { format } from 'date-fns';
import { createContext, useContext, useState } from 'react';

type FilterOption = 'month' | 'last-month' | 'year';

interface DateFilterContextType {
  filter: FilterOption;
  setFilter: (value: FilterOption) => void;
  year: string;
  setYear: (value: string) => void;
}

const DateFilterContext = createContext<DateFilterContextType | undefined>(undefined);

export const DateFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filter, setFilter] = useState<FilterOption>('month');

  
  const [year,setYear]= useState(format(Date.now(),"yyyy"))



  return (
    <DateFilterContext.Provider value={{ filter, setFilter , year , setYear}}>
      {children}
    </DateFilterContext.Provider>
  );
};

export const useDateFilter = () => {
  const context = useContext(DateFilterContext);
  if (!context) {
    throw new Error('useDateFilter must be used within a DateFilterProvider');
  }
  return context;
};
