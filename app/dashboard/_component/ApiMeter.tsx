'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, useAnimation, useMotionValue, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

type ApiUsageCardProps = {
  used: number;
  limit: number;
};

export default function ApiUsageCard({ used, limit }: ApiUsageCardProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const radius = 90;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const strokeControls = useAnimation();
  const count = useMotionValue(0);
  const [displayPercentage, setDisplayPercentage] = useState(0);
  
  useEffect(() => {
    strokeControls.start({
      strokeDashoffset: offset,
      transition: { duration: 1.2, ease: 'easeOut' },
    });

    const controls = animate(count, percentage, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (latest : number ) => setDisplayPercentage(parseFloat(latest.toFixed(1))),
    });

    return () => controls.stop();
  }, [offset, percentage, count, strokeControls]);

  return (
    <Card className="w-full">
      <CardHeader className="text-center text-sm text-muted-foreground">
        <CardTitle>API Usage</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-full">
        <div className="relative">
          <svg width={radius * 2} height={radius * 2} >
            <circle
              className='stroke-muted'
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <motion.circle
              className="text-primary"
              stroke="currentColor"
              fill="transparent"
              strokeWidth={stroke}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              animate={strokeControls}
            />
          </svg>
          
          <div className="absolute inset-0 flex w-full h-full justify-center items-center">
            <span className="pl-1 text-3xl font-bold text-foreground">
              {displayPercentage}%
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground justify-center">
        {used} of {limit} requests used
      </CardFooter>
    </Card>
  );
}
