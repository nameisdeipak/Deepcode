

import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router'; // Fixed import
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import Header from '../components/Header';
import { Check,Frown, Sidebar, Filter, TagsIcon, Diff, X, GaugeCircle, SwatchBook, ArrowBigLeft } from 'lucide-react';


function ProblemList() {
    const { tags } = useParams();

    // console.log(tags);

    //   const dispatch = useDispatch();
    const { user, theme } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);


    const [isLoading, setIsLoading] = useState(false)
    //   const [countProblems, setCountProblems] = useState([]);

    //   // filter seletion statee
    const [status, setStatus] = useState('all')
    //   const [tag, setTag] = useState('all')
    const [difficulty, setDifficulty] = useState('all')

    const [filters, setFilters] = useState({
        difficulty: 'all',
        // tag: 'all',
        status: 'all',
        search: ''
    });

    useEffect(() => {
        const fetchTagsProblems = async () => {
            setIsLoading(true)
            try {
                const { data } = await axiosClient.get(`/problem/problembyTag/${tags}`);
                setProblems(data);
            } catch (error) {
                console.error('Error fetching problems:', error);
            }
        };

        const fetchSolvedProblems = async () => {
            try {
                const { data } = await axiosClient.get('/problem/problemSolvedByUser');
                setSolvedProblems(data);
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching solved problems:', error);
            }
        };




        fetchTagsProblems();
        // fetchProblmesCount();
        if (user) fetchSolvedProblems();
    }, [user, tags]);




    const ResetFilter = () => {
        setFilters({
            difficulty: 'all',
            //   tag: 'all',
            status: 'all',
            search: ''
        })
        setStatus((pre) => pre = 'all')
        setDifficulty((pre) => pre = 'all')
        // setTag((pre) => pre = 'all')
    }


    const createFilter = () => {
        setFilters({
            difficulty: difficulty,
            //   tag: tag,
            status: status,
            search: ''

        })
    }

    const filteredProblems = problems.filter(problem => {
        const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
        // const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
        const statusMatch = filters.status === 'all' ||
            solvedProblems.some(sp => sp._id === problem._id);
        const searchMatch = problem.title.toLowerCase().includes(filters.search.toLowerCase());
        return difficultyMatch && statusMatch && searchMatch;
    });




    if (isLoading) {
        return (
            <>
                <Header />
                <div className="min-h-screen ">


                    {/* Main Content */}
                    <div className="px-4 py-4 flex justify-center  ">
                        {/* <div className='   container bg-gray-/30 w-xs relative'>
            <span className='  absolute right-3 top-3'><Sidebar /></span>
          </div> */}

                        <div className='w-7xl p-2 shadow rounded animate-pulse '>
                            {/* Filters BAR */}
                            <div className="flex  flex-col items-center   justify-between flex-wrap gap-4 mb-8">
                                {/* New Status Filter */}

                                <div className='flex   w-full bg-gray-300/0  p-2 items-center  gap-5 flex-wrap '>

                                    <span className='p-5'></span>
                                </div>


                                <div className='flex   w-full bg-gray-300/0 p-2 items-center justify-between gap-5 flex-wrap '>

                                    <div className='flex justify-between w-85 gap-5  bg-red-95/0 items-center'>
                                        <span className='px-8 py-4 w-xl  bg-gray-200'></span>


                                    </div>



                                </div>


                            </div>

                            {/* Problems List */}
                            <div className="flex flex-col rounded-sm  gap-4 justify-center items-center w-full">
                                <div className={` ${theme == 'dark' ? 'bg-gray-100/8' : 'bg-gray-200/30'} rounded-sm  flex flex-col gap-5 hover:bg-gray-300/40  border-1 border-gray-200/10 w-full   `}>


                                    <div className="flex p-2 justify-between animate-pulse">
                                        <div className="flex items-center justify-between gap-4 truncate w-auto ">

                                            <div className=" text-success w-3">
                                            </div>

                                            <span className=' text-clip truncate px-8 py-2'></span>


                                        </div>

                                        <div className="flex gap-4 justify-between max-sm:justify-start w-auto">
                                            <div className={` truncate  px-4 `}>

                                            </div>

                                        </div>
                                    </div>

                                </div>
                                <div className={` ${theme == 'dark' ? 'bg-gray-100/8' : 'bg-gray-200/30'} rounded-sm  flex flex-col gap-5 hover:bg-gray-300/40  border-1 border-gray-200/10 w-full   `}>


                                    <div className="flex p-2 justify-between animate-pulse">
                                        <div className="flex items-center justify-between gap-4 truncate w-auto ">

                                            <div className=" text-success w-3">
                                            </div>

                                            <span className=' text-clip truncate px-8 py-2'></span>


                                        </div>

                                        <div className="flex gap-4 justify-between max-sm:justify-start w-auto">
                                            <div className={` truncate  px-4 `}>

                                            </div>

                                        </div>
                                    </div>

                                </div>
                                <div className={` ${theme == 'dark' ? 'bg-gray-100/8' : 'bg-gray-200/30'} rounded-sm  flex flex-col gap-5 hover:bg-gray-300/40  border-1 border-gray-200/10 w-full   `}>


                                    <div className="flex p-2 justify-between animate-pulse">
                                        <div className="flex items-center justify-between gap-4 truncate w-auto ">

                                            <div className=" text-success w-3">
                                            </div>

                                            <span className=' text-clip truncate px-8 py-2'></span>


                                        </div>

                                        <div className="flex gap-4 justify-between max-sm:justify-start w-auto">
                                            <div className={` truncate  px-4 `}>

                                            </div>

                                        </div>
                                    </div>

                                </div>
                                <div className={` ${theme == 'dark' ? 'bg-gray-100/8' : 'bg-gray-200/30'} rounded-sm  flex flex-col gap-5 hover:bg-gray-300/40  border-1 border-gray-200/10 w-full   `}>


                                    <div className="flex p-2 justify-between animate-pulse">
                                        <div className="flex items-center justify-between gap-4 truncate w-auto ">

                                            <div className=" text-success w-3">
                                            </div>

                                            <span className=' text-clip truncate px-8 py-2'></span>


                                        </div>

                                        <div className="flex gap-4 justify-between max-sm:justify-start w-auto">
                                            <div className={` truncate  px-4 `}>

                                            </div>

                                        </div>
                                    </div>

                                </div>
                                <div className={` ${theme == 'dark' ? 'bg-gray-100/8' : 'bg-gray-200/30'} rounded-sm  flex flex-col gap-5 hover:bg-gray-300/40  border-1 border-gray-200/10 w-full   `}>


                                    <div className="flex p-2 justify-between animate-pulse">
                                        <div className="flex items-center justify-between gap-4 truncate w-auto ">

                                            <div className=" text-success w-3">
                                            </div>

                                            <span className=' text-clip truncate px-8 py-2'></span>


                                        </div>

                                        <div className="flex gap-4 justify-between max-sm:justify-start w-auto">
                                            <div className={` truncate  px-4 `}>

                                            </div>

                                        </div>
                                    </div>

                                </div>
                                <div className={` ${theme == 'dark' ? 'bg-gray-100/8' : 'bg-gray-200/30'} rounded-sm  flex flex-col gap-5 hover:bg-gray-300/40  border-1 border-gray-200/10 w-full   `}>


                                    <div className="flex p-2 justify-between animate-pulse">
                                        <div className="flex items-center justify-between gap-4 truncate w-auto ">

                                            <div className=" text-success w-3">
                                            </div>

                                            <span className=' text-clip truncate px-8 py-2'></span>


                                        </div>

                                        <div className="flex gap-4 justify-between max-sm:justify-start w-auto">
                                            <div className={` truncate  px-4 `}>

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
    }

    return (
        <>
            <Header></Header>
            <div className="min-h-screen pt-10 ">



                {/* Main Content */}
                <div className="px-4 py-4 flex justify-center   ">


                    <div className='w-5xl mx-auto  p-2 shadow rounded border border-gray-50/10'>

                        <div className="flex  flex-col items-center   justify-between flex-wrap gap-4 mb-8">

                            <div className='flex justify-between     w-full bg-gray-300/0 border-b-0 border-gray-200 p-2 items-center   flex-wrap '>
                                <h1 >{tags.charAt(0).toUpperCase() + tags.slice(1).toLocaleLowerCase()} Problems</h1>
                                <span className='flex justify-center items-center btn btn-xs btn-ghost text-xs' onClick={() => window.history.back()}><ArrowBigLeft size={15} />Back to </span>
                            </div>

                            <div className='flex   w-full bg-gray-300/0 border-b-1 border-gray-200 p-2 items-center justify-between gap-5 flex-wrap '>

                                <div className='flex justify-between w-full gap-5  bg-red-9/0 items-center'>
                                    <label className={`input  rounded w-4/4  h-12 ${theme == 'dark' ? 'bg-black' : 'bg-white'}   `}>
                                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <g
                                                strokeLinejoin="round"
                                                strokeLinecap="round"
                                                strokeWidth="2.5"
                                                fill="none"
                                                stroke="currentColor"
                                            >
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <path d="m21 21-4.3-4.3"></path>
                                            </g>
                                        </svg>
                                        <input type="search" className="grow" placeholder="Search"
                                            value={filters.search}
                                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        />

                                    </label>

                                    <div className=' dropdown dropdown-end'>
                                        <div tabIndex={0} role="button" className={`btn btn-soft btn-sm ${theme == 'dark' ? 'border border-gray-300/20 bg-black' : 'bg-white'} btn-circle avatar `}>

                                            <Filter size={15} />

                                        </div>
                                        <ul tabIndex={0} className={`menu menu-sm gap-3 dropdown-content mt-3 z-[1]  shadow-xl bg-base-100 rounded-box min-h-50 w-auto px-2 ${theme == 'dark' ? 'bg-black' : 'bg-white'}`}>

                                            <div className={`flex  justify-between items-center   p-1 rounded w-xs  ${theme == 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
                                                <span className={`flex justify-center items-center gap-1 ${theme == 'dark' ? 'text-gray-400' : 'text-black'}`}><SwatchBook size={15} /> Status </span>
                                                <select
                                                    className={`select  w-40 rounded   ${theme == 'dark' ? 'bg-black' : 'bg-gray-100/10'}`}
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                >

                                                    <option value="all">All Problems</option>
                                                    <option value="solved">Solved Problems</option>
                                                </select>
                                            </div>

                                            <div className={`flex  justify-between items-center   p-1 rounded w-xs  ${theme == 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
                                                <span className={`flex justify-center items-center gap-1 ${theme == 'dark' ? 'text-gray-400' : 'text-black'}`}><GaugeCircle size={15} /> Diffuculty </span>

                                                <select
                                                    className={`select  w-40 rounded   ${theme == 'dark' ? 'bg-black' : 'bg-gray-100/10'}`}
                                                    value={difficulty}
                                                    onChange={(e) => setDifficulty(e.target.value)}
                                                >
                                                    <option value="all" >Mixed</option>
                                                    <option value="easy" className='text-info'>Easy</option>
                                                    <option value="medium" className='text-warning'>Medium</option>
                                                    <option value="hard" className='text-error'>Hard</option>
                                                </select>
                                            </div>


                                            <div className='flex justify-between items-center  p-1 gap-1 rounded w-xs'>
                                                <button className='btn btn-sm btn-outline btn-success w-4/8' onClick={() => createFilter()}>Fillter</button>
                                                <button className='btn btn-sm btn-outline btn-error w-4/8' onClick={() => ResetFilter()}>Reset</button>
                                            </div>
                                        </ul>
                                    </div>

                                </div>

                                <div className=' p-2 bg-success/0 '>
                                    {solvedProblems.length}/
                                    {problems.length} Solved
                                </div>

                            </div>



                        </div>


                        <div className="flex flex-col rounded-sm  gap-4 justify-center items-center w-full">

                            {filteredProblems.length === 0 && (
                                <div className={`text-center py-10`}>
                                    <Frown className="mx-auto h-12 w-12" />
                                    <p className="mt-2">No problems match your filters.</p>
                                </div>
                            )}

                        
                                      {filteredProblems.map((problem, index) =>
                                        <div key={problem._id} className={` ${theme == 'dark' ? 'bg-gray-100/8' : 'bg-gray-200/30'} rounded-sm   hover:bg-gray-300/40  border-1 border-gray-200/10 w-full   `}>
                        
                                          <NavLink to={`/problem/${problem._id}`} className="  " >
                                            <div className=" flex p-2 justify-between  flex-col sm:flex-row items-start sm:items-start ">
                                              <div className=" flex items-center justify-between gap-4 truncate w-auto sm:items-start">
                        
                                                <div className=" text-success w-3">
                                                  {solvedProblems.some(sp => sp._id === problem._id) && (
                                                    <Check size={18} />
                                                  )}
                                                </div>
                        
                                                <span className=' text-clip truncate'>{`${index + 1}. `}{problem.title}</span>
                        
                        
                                              </div>
                        
                                              <div className="  flex gap-4 justify-between max-sm:justify-start pl-8 sm:pl-auto  w-auto">
                                                <div className={` truncate  ${getDifficultyBadgeColor(problem.difficulty)}`}>
                                                  {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1).toLowerCase()}
                                                </div>
                                                <div className={` truncate `}>
                                                  {problem.tags.charAt(0).toUpperCase() + problem?.tags.slice(1).toLowerCase()}
                                                </div>
                        
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
    );
}

const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
        case 'easy': return 'text-info';
        case 'medium': return 'text-warning';
        case 'hard': return 'text-error';
        default: return 'badge-neutral';
    }
};

export default ProblemList


