
import React from 'react';

export const ShimmerCard = () => {
    return (
     
        <div className="card bg-base-100 w-80 shadow-sm rounded-xl flex-shrink-0">
          
            <div className="animate-pulse">
                {/* Image Placeholder */}
                <div className="h-40 rounded-t-xl bg-slate-200"></div>
                
                <div className="card-body gap-2 p-4">
                    {/* Title and Badge Placeholder */}
                    <div className="flex justify-between items-center gap-4">
                        <div className="h-5 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-5 bg-slate-200 rounded w-16"></div>
                    </div>
                    
                    {/* Subtitle Placeholder */}
                    <div className="h-4 bg-slate-200 rounded w-3/4 mt-2"></div>

                    {/* Stats and Play Button Placeholder */}
                    <div className='flex justify-between items-center mt-4'>
                        <div className="flex justify-start gap-4 items-center">
                            <div className='text-center'>
                                <div className="h-5 w-8 bg-slate-200 rounded mx-auto"></div>
                                <div className="h-3 w-16 bg-slate-200 rounded mt-1"></div>
                            </div>
                            <div className='text-center'>
                                <div className="h-5 w-8 bg-slate-200 rounded mx-auto"></div>
                                <div className="h-3 w-12 bg-slate-200 rounded mt-1"></div>
                            </div>
                        </div>
                        <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};