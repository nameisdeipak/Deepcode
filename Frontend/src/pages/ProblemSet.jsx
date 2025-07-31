

import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import Header from '../components/Header';
import DeepcodeLoader from "../components/DeepcodeLoader";

import { toast, Toaster } from 'react-hot-toast';
import { Check, Sidebar,Loader2, Filter,Frown, TagsIcon, Diff, X, GaugeCircle, SwatchBook } from 'lucide-react';

function ProblemSet() {
  const dispatch = useDispatch();
  const { user, theme } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [countProblems, setCountProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  // filter seletion statee
  const [status, setStatus] = useState('all')
  const [tag, setTag] = useState('all')
  const [difficulty, setDifficulty] = useState('all')

  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all',
    search: ''
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
            toast.error(error);
      }
    };

    const fetchSolvedProblems = async () => {
setIsLoading(true)
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
      toast.error(error);
      }
    };
    const fetchProblmesCount = async () => {
      try {

        const { data } = await axiosClient.get('/problem/distinctProblems');
        setCountProblems(data?.problems);
        setIsLoading(false)
      } catch (error) {
             toast.error(error);
      }
    }

    fetchProblems();
    fetchProblmesCount();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]); // Clear solved problems on logout
  };



  const ResetFilter = () => {
    setFilters({
      difficulty: 'all',
      tag: 'all',
      status: 'all',
      search: ''
    })
    setStatus((pre) => pre = 'all')
    setDifficulty((pre) => pre = 'all')
    setTag((pre) => pre = 'all')
  }


  const createFilter = () => {
    setFilters({
      difficulty: difficulty,
      tag: tag,
      status: status,
      search: ''

    })
  }

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' ||
      solvedProblems.some(sp => sp._id === problem._id);
    const searchMatch = problem.title.toLowerCase().includes(filters.search.toLowerCase());
    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });


    const themeClasses = {
    bg: theme === 'dark' ? 'bg-black' : 'bg-white',
    text: theme === 'dark' ? 'text-gray-200' : 'text-gray-900',
  }

  
  
  if (isLoading) {
    return (
         <DeepcodeLoader/>
    );
  }




  return (
    <>
       <Toaster position="top-center" reverseOrder={false} />
      <Header></Header>
      <div className="min-h-screen  pt-10">

   <h1 className={`text-3xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                   Explore Problem's 
                    </h1>
        {/* Main Content */}
        <div className="px-4 py-4 flex justify-center  ">
             
           

          <div className='w-5xl p-2 shadow rounded border border-gray-50/10'>
            {/* Filters BAR */}
            <div className="flex  flex-col items-center   justify-between flex-wrap gap-4 mb-8">
              {/* New Status Filter */}

              <div className='flex   w-full bg-gray-300/0 border-b-1 border-gray-200 p-2 items-center  gap-5 flex-wrap '>

                {countProblems.map((item, index) => (
                  <NavLink to={`/problem-list/${item?.tags}/`}
                    key={index}
                    className='flex justify-center items-center hover:text-primary gap-1'
                  >

                    <span className=''>{item?.tags.charAt(0).toUpperCase() + item?.tags.slice(1).toLowerCase()}  </span>
                    <span className=' rounded-4xl px-2 text-[12px] bg-gray-200/50'>{item?.count}</span>
                  </NavLink>
                ))}
              </div>


              <div className='flex   w-full bg-gray-300/0  border-b-1 border-gray-200 p-2 items-center justify-between gap-5 flex-wrap '>

                <div className='flex justify-between w-full gap-5  bg-red-9/0 items-center'>
                  <label className={`input  rounded w-4/4  h-12 ${theme=='dark'?'bg-black':'bg-white'}   `}>
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
                    <input type="search" className="grow  " placeholder="Search"
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

                      <div className={`flex  justify-between items-center   p-1 rounded w-xs  ${theme == 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
                        <span className={`flex justify-center items-center gap-1 ${theme == 'dark' ? 'text-gray-400' : 'text-black'}`}><TagsIcon size={15} /> Topics </span>
                        <select
                          className={`select  w-40 rounded   ${theme == 'dark' ? 'bg-black' : 'bg-gray-100/10'}`}
                          value={tag}
                          onChange={(e) => setTag(e.target.value)}
                        >

                          <option value="all">All Tags</option>
                          {countProblems.map((item, index) => (
                            <option key={index} value={item?.tags}>{item?.tags.charAt(0).toUpperCase() + item?.tags.slice(1).toLowerCase()}</option>

                          ))}

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

            {/* Problems List */}
            <div className="flex flex-col rounded-sm  gap-4 justify-center items-center w-full">

              { filteredProblems.length === 0  && (
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

export default ProblemSet;



