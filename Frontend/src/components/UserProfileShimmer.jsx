import React from 'react';

import { useSelector } from 'react-redux';
import Header from './Header';

const ProfileSkeleton = () => {
    const { theme } = useSelector(state => state.auth)


    return (
        <>
        <Header/>
            <div className="flex  mt-5 flex-col lg:flex-row  gap-8 justify-center  mx-auto w-full max-w-max py-4 max-lg:px-6   ">

                <div className={`w-xs lg:w-xs animate-pulse   rounded-md h-full py-2 p-2  ${theme == 'dark' ? 'bg-gray-100/10' :  'shadow bg-gray-200'}   `}>


                    {/* profile  */}
                    <div className=" flex flex-col w-full gap-4 px-4 py-6 border-b border-gray-500/20">

                        <div className="avatar flex justify-start gap-1  items-start rounded">
                            <div className=" rounded-full ring-0 shadow bg-gray-50 ring-black w-24  animate-pulse ">
                          
                            </div>
                            <div className="flex flex-col gap-2 w-auto max-h-max px-4 py-2 justify-center items-center animate-pulse ">
                                <div className="text-sm  flex flex-col p-3 ">

                                    <span className="text-gray-400/70 text-xs p-2">

                                    </span>
                                </div>
                                <p className="text-md p-4 "></p>
                            </div>

                        </div>
                        <div className="w-full p-4 bg-gray-300/30 animate-pulse "></div>
                    </div>

                    {/* Language  */}
                    <div className=" flex flex-col w-full gap-4 px-4 py-6 border-b border-gray-300/50">

                        <div className=" flex justify-start gap-4 flex-wrap items-start rounded">
                            :

                            <span className="text-xs badge badge-ghost rounded-xl p-4 "></span>
                            <span className="text-xs badge badge-ghost rounded-xl p-4 "></span>
                            <span className="text-xs badge badge-ghost rounded-xl p-4 "></span>
                            <span  className="text-xs badge badge-ghost rounded-xl p-4 "></span>


                        </div>

                    </div>

                    {/* Skills   */}
                    <div className=" flex flex-col w-full gap-4 px-4 py-6 ">

                        <div className=" flex justify-start  gap-4 flex-wrap items-start rounded">



                            <div  className="flex gap-1 text-xs   justify-center items-center">

                                <span className=" text-xs badge badge-ghost  rounded-xl p-4  "></span>

                            </div>

                            <div  className="flex gap-1 text-xs   justify-center items-center">

                                <span className=" text-xs badge badge-ghost  rounded-xl p-4  "></span>

                            </div>

                            <div  className="flex gap-1 text-xs   justify-center items-center">

                                <span className=" text-xs badge badge-ghost  rounded-xl p-4  "></span>

                            </div>





                        </div>

                    </div>

                </div>

                <div className={` w-full lg:w-3xl  h-full rounded p-2 animate-pulse   ${theme == 'dark' ? ' ' : ''}`}>
                    <div className=" flex flex-col gap-4">
                        <div className='w-full p-8 py-20 bg-gray-200 animate-pulse'></div>
                        <div className='w-full p-8 py-20 bg-gray-200 animate-pulse'></div>

                        <div className={`flex flex-col rounded-sm p-6  gap-4 justify-center items-center w-full animate-pulse  ${theme == 'dark' ? 'bg-gray-100/5 ' : 'shadow'}`}>
                  
                            <div className="flex justify-start w-full ">

                                <span className=" text-sm font-semibold px-4 py-2  "> </span>
                            </div>

                            <div className={` ${theme == 'dark' ? 'bg-gray-100/0' : 'bg-gray-200'} rounded-sm flex  flex-col  gap-10   hover:bg-gray-300/40  border-1 border-gray-200/10 w-full   `}>

                                <div className=" w-full p-2   " >
                                    <div className="flex p-2 justify-between truncate ">
                                        <div className="flex items-center justify-between gap-4 truncate w-auto ">
                                            <span className=' text-clip truncate '></span>
                                        </div>


                                    </div>
                                </div>
                                <div className=" w-full p-2  " >
                                    <div className="flex p-2 justify-between truncate ">
                                        <div className="flex items-center justify-between gap-4 truncate w-auto ">
                                            <span className=' text-clip truncate '></span>
                                        </div>


                                    </div>
                                </div>
                                <div className=" w-full p-2  " >
                                    <div className="flex p-2 justify-between truncate ">
                                        <div className="flex items-center justify-between gap-4 truncate w-auto ">
                                            <span className=' text-clip truncate '></span>
                                        </div>


                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )

};

export default ProfileSkeleton;