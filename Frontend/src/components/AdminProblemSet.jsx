



import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import to react-router-dom
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import Header from '../components/Header';
import { Check, Filter, TagsIcon, X, GaugeCircle, SwatchBook, Frown ,TriangleAlert } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

// A simple SVG icon for the modal
const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
function AdminProblemSet() {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null); // Will store { _id, title }

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
      }
    };

    const fetchSolvedProblems = async () => {
      setIsLoading(true)
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };
    const fetchProblmesCount = async () => {
      try {

        const { data } = await axiosClient.get('/problem/distinctProblems');
        setCountProblems(data?.problems);
        setIsLoading(false)
      } catch (error) {
        alert('Error fetching solved problems:', error);
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
    const statusMatch = filters.status === 'all' ? true : // Show all if 'all'
      filters.status === 'solved' ? solvedProblems.some(sp => sp._id === problem._id) :
        !solvedProblems.some(sp => sp._id === problem._id);
    const searchMatch = problem.title.toLowerCase().includes(filters.search.toLowerCase());
    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });


  const handleOpenModal = (problem) => {
    setProblemToDelete(problem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isDeleting) return; 
    setIsModalOpen(false);
    setProblemToDelete(null);
  };


  const handleConfirmDelete = async () => {
    if (!problemToDelete) return;

    setIsDeleting(true);
    try {
      await axiosClient.delete(`/problem/delete/${problemToDelete._id}`);
      setProblems(problems.filter(p => p._id !== problemToDelete._id));
      handleCloseModal();
      toast.success('Successfully Delete problem.');
    } catch (err) {
      toast.error('Failed to delete the problem.');
      console.error(err);
   
    } finally {
      setIsDeleting(false);
    }
  };


  const isDark = theme === 'dark';
  const themeClasses = {
    page: isDark ? 'bg-black text-gray-300' : 'bg-white text-black',
    container: isDark ? 'bg-gray-100/5 border-gray-100/20' : 'bg-white border-gray-200',
    modalBox: isDark ? 'bg-black border border-gray-100/20 text-white' : 'bg-white text-black',
    tableHeader: isDark ? 'text-gray-200 bg-gray-200/10' : 'text-gray-600 bg-gray-50',
    tableRow: isDark ? 'hover:bg-gray-100/10 border-gray-700' : 'hover:bg-gray-50 border-gray-200',
    labelMuted: isDark ? 'text-gray-400' : 'text-gray-500',
  };


  if (isLoading) {
    return (
      <>
        
        <div className="min-h-screen ">

          <div className="px-4 py-4 flex justify-center  ">
            <div className='w-7xl p-2 shadow  rounded animate-pulse '>
              <div className="flex  flex-col items-center   justify-between flex-wrap gap-4 mb-8">
                <div className='flex   w-full bg-gray-300/0  p-2 items-center  gap-5 flex-wrap '>
                  <span className='p-5'></span>
                </div>
                <div className='flex   w-full bg-gray-300/0 p-2 items-center justify-between gap-5 flex-wrap '>
                  <div className='flex justify-between w-85 gap-5  bg-red-95/0 items-center'>
                    <span className='px-8 py-4 w-xl  bg-gray-200'></span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col rounded-sm  gap-4 justify-center items-center w-full">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={` ${theme == 'dark' ? 'bg-gray-100/8' : 'bg-gray-200/30'} rounded-sm  flex flex-col gap-5 hover:bg-gray-300/40  border-1 border-gray-200/10 w-full   `}>
                    <div className="flex p-2 justify-between animate-pulse">
                      <div className="flex items-center justify-between gap-4 truncate w-auto ">
                        <div className=" text-success w-3"></div>
                        <span className=' text-clip truncate px-8 py-2 bg-gray-300/50'></span>
                      </div>
                      <div className="flex gap-4 justify-between max-sm:justify-start w-auto">
                        <div className={` truncate  px-4 bg-gray-300/50`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={`min-h-screen `}>

        <div className=" w-full px-1 md:px-4  mx-auto    py-4">
          <div className='w-full py-2 text-md' >All List's of Problems</div>
          <div className='w-full p-2 shadow rounded border border-gray-50/10'>
            {/* Filters BAR */}
            <div className="flex flex-col items-center justify-between gap-4 mb-8">
           
              <div className='flex w-full bg-gray-300/0 border-b-1 border-gray-200 p-2 items-center gap-x-4 gap-y-2 flex-wrap'>
                {countProblems.map((item, index) => (
                  <NavLink to={`/problem-list/${item?.tags}/`}
                    key={index}
                    className='flex justify-center items-center hover:text-primary gap-1'
                  >
                    <span>{item?.tags.charAt(0).toUpperCase() + item?.tags.slice(1).toLowerCase()}</span>
                    <span className='rounded-4xl px-2 text-[12px] bg-gray-200/50'>{item?.count}</span>
                  </NavLink>
                ))}
              </div>

            
              <div className='flex w-full bg-gray-300/0 border-b-1 border-gray-200 p-2 items-center justify-between gap-4 flex-wrap'>
               
                <div className='flex justify-between w-full gap-5  bg-red-9/0 items-center'>
                  <label className={`input rounded  w-4/4  h-12  items-center gap-2  ${theme == 'dark' ? 'bg-gray-200/20' : 'bg-gray-300'}`}>
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </g>
                    </svg>
               
                    <input type="search" className={`grow bg-transparent w-full`} placeholder="Search"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </label>

                  <div className='dropdown dropdown-end flex-shrink-0'>
                    <div tabIndex={0} role="button" className={`btn btn-soft btn-sm ${theme == 'dark' ? 'border border-gray-300/20 bg-black' : ' shadow bg-white text-black'} btn-circle avatar `}>
                      <Filter size={15} />
                    </div>
                    <ul tabIndex={0} className={`menu menu-sm gap-3 dropdown-content mt-3 z-[1] shadow-xl bg-base-100 rounded-box min-h-50 w-64 sm:w-auto px-2 ${theme == 'dark' ? 'bg-black' : 'bg-white'}`}>
                      <div className={`flex justify-between items-center p-1 rounded w-full ${theme == 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
                        <span className={`flex justify-center items-center gap-1 ${theme == 'dark' ? 'text-gray-400' : 'text-black'}`}><SwatchBook size={15} /> Status </span>
                        <select className={`select select-sm w-40 rounded ${theme == 'dark' ? 'bg-black' : 'bg-gray-100/10'}`}
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}>
                          <option value="all">All</option>
                          <option value="solved">Solved</option>
                        </select>
                      </div>
                      <div className={`flex justify-between items-center p-1 rounded w-full ${theme == 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
                        <span className={`flex justify-center items-center gap-1 ${theme == 'dark' ? 'text-gray-400' : 'text-black'}`}><GaugeCircle size={15} /> Difficulty </span>
                        <select className={`select select-sm w-40 rounded ${theme == 'dark' ? 'bg-black' : 'bg-gray-100/10'}`}
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}>
                          <option value="all">Mixed</option>
                          <option value="easy" className='text-info'>Easy</option>
                          <option value="medium" className='text-warning'>Medium</option>
                          <option value="hard" className='text-error'>Hard</option>
                        </select>
                      </div>
                      <div className={`flex justify-between items-center p-1 rounded w-full ${theme == 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
                        <span className={`flex justify-center items-center gap-1 ${theme == 'dark' ? 'text-gray-400' : 'text-black'}`}><TagsIcon size={15} /> Topics </span>
                        <select className={`select select-sm w-40 rounded ${theme == 'dark' ? 'bg-black' : 'bg-gray-100/10'}`}
                          value={tag}
                          onChange={(e) => setTag(e.target.value)}>
                          <option value="all">All Tags</option>
                          {countProblems.map((item, index) => (
                            <option key={index} value={item?.tags}>{item?.tags.charAt(0).toUpperCase() + item?.tags.slice(1).toLowerCase()}</option>
                          ))}
                        </select>
                      </div>
                      <div className='flex justify-between items-center p-1 gap-2 rounded w-full'>
                        <button className='btn btn-sm btn-outline btn-success w-1/2' onClick={() => createFilter()}>Filter</button>
                        <button className='btn btn-sm btn-outline btn-error w-1/2' onClick={() => ResetFilter()}>Reset</button>
                      </div>
                    </ul>
                  </div>
                </div>
             
                <div className='p-2 bg-success/0   flex-shrink-0'>
                  Total Problems : {problems.length}
     
                </div>
              </div>
            </div>

            {/* Problems List */}
            <div className="flex flex-col rounded-sm gap-4 justify-center items-center w-full">
              {filteredProblems.length === 0 && (
                <div className={`text-center py-10`}>
                  <Frown className="mx-auto h-12 w-12" />
                  <p className="mt-2">No problems match your filters.</p>
                </div>
              )}
              {filteredProblems.map((problem, index) =>
                <div key={problem._id} className={` ${theme == 'dark' ? 'bg-gray-100/8' : 'bg-gray-200/30'} rounded-sm hover:bg-gray-300/40 border-1 border-gray-200/10 w-full`}>

                  <div className=" grid grid-cols-1 gap-2  p-2 md:grid-cols-2 ">

                    <div className="  flex  justify-between  px-2 items-start  sm:items-center gap-4 overflow-hidden ">
                      <span className='truncate'>{`${index + 1}. `}{problem.title}</span>

                      <div className='flex gap-4'>
                        <div className={`truncate flex-shrink-0 whitespace-nowrap ${getDifficultyBadgeColor(problem.difficulty)}`}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1).toLowerCase()}
                        </div>
                        <div className={`truncate flex-shrink-0 whitespace-nowrap `}>
                         
                        </div>
                      </div>

                    </div>

                    <div className=' flex justify-center  md:justify-end items-center gap-6 px-2'>

                      <NavLink to={`/problem/${problem._id}`}
                        className='btn btn-sm btn-outline btn-success'
                      >
                        view
                      </NavLink>

                      <NavLink to={`/admin/update-problem/${problem._id}`}
                        className='btn btn-sm btn-outline btn-primary'
                      >
                        Update
                      </NavLink>

                      <button
                        className="btn btn-sm btn-error btn-outline"
                        onClick={() => handleOpenModal(problem)} >Delete</button>
                    </div>
             
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>



      <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className={`modal-box ${themeClasses.modalBox}`}>
          <div className="flex flex-col items-center justify-center gap-4">
            <TriangleAlert  size={50} color={'red'} />
            <div>
              <h3 className="font-bold text-lg text-center mt-2">Confirm Deletion</h3>
              <p className="py-4 text-center">
                Are you sure you want to delete the problem "<strong>{problemToDelete?.title}</strong>"? This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="modal-action justify-center">
            <button onClick={handleCloseModal} className="btn btn-ghost" disabled={isDeleting}>Cancel</button>
            <button onClick={handleConfirmDelete} className="btn btn-error" disabled={isDeleting}>
              {isDeleting ? <span className="loading loading-spinner"></span> : 'Delete Problem'}
            </button>
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

export default AdminProblemSet;
