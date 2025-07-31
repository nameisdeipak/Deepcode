
import React from 'react';
import { NavLink } from 'react-router';
import { Play, Lock } from 'lucide-react';
import { useSelector } from 'react-redux';


const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
        <path d="M7.5 5.612v12.776c0 .91.954 1.482 1.755.998l10.09-6.388a1.12 1.12 0 000-1.996L9.255 4.614A1.125 1.125 0 007.5 5.612z" />
    </svg>
);

const CourseCard = ({ course }) => {
    
    const { theme } = useSelector((state) => state.auth);
    const { title,
        subTitle,
        chapters,
        items,
        courseType,
        status,
        price,
        premium,
        courseUrl,
        image } = course;

    return (
        <div className={`card ${theme == 'light' ? ' glass' : 'bg-gray-100/0 border-gray-100/20  '} border  w-80 shadow-sm rounded-xl inline-flex flex-shrink-0 hover:scale-104 transition-transform duration-200`}>

            <div className='relative h-50 overflow-hidden rounded-xl p-2'>
                <img
                    src={image.url}

                    className='w-full h-full object-cover rounded-xl'
                    alt="" />

                {(premium === true) && (


                    <span
                        className='absolute top-4 right-4 btn btn-sm btn-circle p-2 btn-warning border-warning'><Lock />
                    </span>
                )}
            </div>
            <div className="card-body gap-2 p-4">
                <h2 className="card-title flex justify-between">
                    {title}
                    <div className="badge badge-secondary">NEW</div>
                </h2>
                <p className='truncate'>{subTitle}</p>
                <div className='flex justify-between items-center'>
                    <div className="flex justify-start gap-4 items-center text-center text-gray-600">
                        <div>
                            <p className="font-bold text-xl text-base-400">{chapters.length}</p>
                            <p className="text-xs">Chapters</p>
                        </div>
                 
                    </div>
                    
                    <Play className='btn btn-sm btn-circle p-2 btn-primary'></Play>
                    {/* </NavLink> */}
                </div>
                <div className="card-actions items-center justify-between">
                    {/* ... other actions */}
                </div>
            </div>
        </div>
   
    );
};

export default CourseCard;

