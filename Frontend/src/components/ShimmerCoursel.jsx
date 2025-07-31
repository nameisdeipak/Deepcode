
import React from 'react';
import { ShimmerCard } from './ShimmerCard';

export const ShimmerCoursel = () => {
    return (
  
        <div className="w-full   max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative flex flex-col items-center justify-center">
            <div className="h-8 bg-slate-200 rounded w-full mb-6"></div>

            <div className="  flex flex-wrap gap-10  justify-center items-center overflow-hidden space-x-6 ">

                {Array.from({ length: 6 }).map((_, index) => (
                    <ShimmerCard key={index} />
                ))}
            </div>
        </div>
    );
};