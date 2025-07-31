import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContributionGraph from "../components/ContributionGraph";
import { NavLink } from "react-router";
import { toast, Toaster } from 'react-hot-toast';
import axiosClient from "../utils/axiosClient";
import ProgressStatsCard from "../components/ChartProblems";
import ProfileSkeleton from "../components/UserProfileShimmer";
function UserProfile() {

    const { user, theme } = useSelector(state => state.auth);
    const [userPerformace, setUserPerformace] = useState(null)
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);




    useEffect(() => {


        const FetachUserPerfomace = async () => {
            setIsLoading(true);
            try {
                const response = await axiosClient.get("/user/RankAndLanguage");

                setUserPerformace(response?.data);
                setIsLoading(false);
            } catch (error) {
                toast.error("failed to fetch ");
            }
        }

        const fetchSolvedProblems = async () => {
            // setIsLoading(true);
            try {
                const { data } = await axiosClient.get('/problem/problemSolvedByUser');
                setSolvedProblems(data);
                // setIsLoading(false);
            } catch (error) {
                toast.error(`${error}`);
            }
        };


        FetachUserPerfomace()
        fetchSolvedProblems();


    }, [user])


    // console.log(userPerformace);

    
      const themeClasses = {
        bg: theme === 'dark' ? 'bg-black' : 'bg-white',
        sectionBg: theme === 'dark' ? 'bg-black' : 'bg-slate-50',
        textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
        accent: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        border: theme === 'dark' ? 'border-gray-200/20' : 'border-white',
    }


    if (isLoading) {
        return <ProfileSkeleton />
    }



    return (
        <>
            <Header />

            {/* main Content start  */}
            <div className="flex  min-h-screen mt-5 flex-col lg:flex-row  gap-8 justify-center  mx-auto w-full max-w-max py-4 max-lg:px-6   ">

                <div className={`w-full lg:w-xs   rounded-md h-full py-2 p-2  ${theme == 'dark' ? 'bg-gray-100/5' : 'glass'}   `}>


                    {/* profile  */}
                    <div className=" flex flex-col w-full gap-4 px-4 py-6 border-b border-gray-300/50">

                        <div className="avatar flex justify-start gap-1   items-start rounded">
                            <div className=" rounded-full ring-1 ring-black w-24  ">
                                <img src={`${(user?.profile?.profile_url) ? (user?.profile?.profile_url) : (`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`)}`} />
                            </div>
                            <div className="flex flex-col gap-2 w-auto max-h-max px-4 py-2 justify-center items-center  ">
                                <div className="text-sm  flex flex-col ">



                                    {user?.userName?.charAt(0).toUpperCase() + user?.userName?.slice(1).toLowerCase()}
                                    <span className="text-gray-400/70 text-xs">
                                        {user?.userName?.charAt(0).toUpperCase() + user?.userName?.slice(1).toLowerCase()}
                                    </span>


                                    <div className="flex flex-col gap-0 mt-2 ">
                                        <span className="text-xs truncate"><span className={themeClasses.textSecondary}>FirstName:  </span> {user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1).toLowerCase()}</span>
                                        <span className="text-xs truncate"><span className={themeClasses.textSecondary}>LastName:  </span>{user?.lastName?.charAt(0).toUpperCase() + user?.lastName?.slice(1).toLowerCase()}</span>
                                    </div>


                                </div>
                                <p className="text-md">Rank ~{userPerformace?.result?.rank}</p>
                            </div>


                        </div>

                        <NavLink to={`/profile`} className="btn  btn-sm btn-outline btn-primary ">Edit Profile</NavLink>
                    </div>

                    {/* Language  */}
                    <div className=" flex flex-col w-full gap-4 px-4 py-6 border-b border-gray-300/50">

                        <div className=" flex justify-start gap-4 flex-wrap items-start rounded">
                            Language:
                            {
                                userPerformace?.result?.languages?.map((item, index) => (
                                    <span key={index} className="text-xs badge badge-ghost rounded-xl ">{item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}</span>
                                ))
                            }

                        </div>

                    </div>

                    {/* Skills   */}
                    <div className=" flex flex-col w-full gap-4 px-4 py-6 ">

                        <div className=" flex justify-start  gap-4 flex-wrap items-start rounded">
                            Skills :
                            {
                                userPerformace?.skills?.userStats?.tagCounts?.map((item, index) => (
                                    <div key={index} className="flex gap-1 text-xs   justify-center items-center">

                                        <span className=" text-xs badge badge-ghost  rounded-xl ">{item?.tag.charAt(0).toUpperCase() + item?.tag.slice(1).toLowerCase()}
                                        </span>
                                        x{item?.count}
                                    </div>
                                ))
                            }



                        </div>

                    </div>

                </div>

                <div className={` w-full lg:w-3xl  h-full rounded p-2   ${theme == 'dark' ? ' ' : ''}`}>
                    <div className=" flex flex-col">
                        <ProgressStatsCard stats={userPerformace?.skills?.userStats} problemsByDifficulty={userPerformace?.skills.problemsByDifficulty} />
                        <ContributionGraph submission={userPerformace?.submisson} />


                        <div className={`flex flex-col rounded-sm p-6  gap-4 justify-center items-center w-full  ${theme == 'dark' ? 'bg-gray-100/5 ' : 'shadow'}`}>

                            <div className="flex justify-start w-full">

                                <span className=" text-sm font-semibold">Solved Problems </span>
                            </div>
                            {solvedProblems.map((problem, index) =>
                                <div key={problem._id} className={` ${theme == 'dark' ? 'bg-gray-100/0' : 'bg-gray-200/30'} rounded-sm   hover:bg-gray-300/40  border-1 border-gray-200/10 w-full   `}>

                                    <NavLink to={`/problem/${problem._id}`} className="  " >
                                        <div className="flex p-2 justify-between truncate ">
                                            <div className="flex items-center justify-between gap-4 truncate w-auto ">



                                                <span className=' text-clip truncate'>{`${index + 1}. `}{problem.title}</span>


                                            </div>


                                        </div>
                                    </NavLink>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}


export default UserProfile;