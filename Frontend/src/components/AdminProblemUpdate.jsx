

import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { Check, Filter, TagsIcon, GaugeCircle, SwatchBook, Frown } from 'lucide-react';

function AdminProblemUpdate() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, theme } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [countProblems, setCountProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [status, setStatus] = useState('all');
    const [tag, setTag] = useState('all');
    const [difficulty, setDifficulty] = useState('all');

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
            } catch (error) { console.error('Error fetching problems:', error); }
        };
        const fetchSolvedProblems = async () => {
            setIsLoading(true);
            try {
                const { data } = await axiosClient.get('/problem/problemSolvedByUser');
                setSolvedProblems(data);
            } catch (error) { console.error('Error fetching solved problems:', error); }
        };
        const fetchProblmesCount = async () => {
            try {
                const { data } = await axiosClient.get('/problem/distinctProblems');
                setCountProblems(data?.problems);
                setIsLoading(false);
            } catch (error) { alert('Error fetching solved problems:', error); }
        };
        fetchProblems();
        fetchProblmesCount();
        if (user) fetchSolvedProblems();
    }, [user]);


    const ResetFilter = () => {
        setFilters({ difficulty: 'all', tag: 'all', status: 'all', search: '' });
        setStatus('all');
        setDifficulty('all');
        setTag('all');
    };

    const createFilter = () => {
        setFilters({ difficulty: difficulty, tag: tag, status: status, search: filters.search });
    };

    const handleUpdateClick = (problemId) => {
        navigate(`/admin/update-problem/${problemId}`);
    };

    const filteredProblems = problems.filter(problem => {
        const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
        const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
        const statusMatch = filters.status === 'all' ? true :
            filters.status === 'solved' ? solvedProblems.some(sp => sp._id === problem._id) :
                !solvedProblems.some(sp => sp._id === problem._id);
        const searchMatch = problem.title.toLowerCase().includes(filters.search.toLowerCase());
        return difficultyMatch && tagMatch && statusMatch && searchMatch;
    });


    const isDark = theme === 'dark';
    const themeClasses = {
        page: isDark ? 'bg-black text-gray-300' : 'bg-white text-black',
        card: isDark ? 'bg-gray-100/5 border-gray-100/20' : 'bg-white border-gray-200',
        label: isDark ? 'text-gray-400' : 'text-gray-600',
        input: isDark ? 'bg-gray-200 border-gray-100/30 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500' : 'bg-white border-gray-200 text-black placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500',

    };


    if (isLoading) {
        return <div className={`min-h-screen ${themeClasses.page}`}>Loading...</div>;
    }

  
    return (
        <div className={`min-h-screen max-w-5xl  mx-auto w-full p-1  sm:p-6 ${themeClasses.page}`}>
            <div className="flex justify-center items-center mb-6">
                <h1 className="text-xl md:text-3xl font-semibold">Update Problems</h1>
            </div>
            <div className={`w-full max-w-6xl mx-auto p-1 sm:p-6 shadow rounded-lg border ${themeClasses.card}`}>
                {/* Filters BAR */}
                <div className="flex flex-col items-center justify-between gap-4 mb-8">
                    {/* Tag Links */}
                    <div className={`flex w-full border-b pb-4 items-center gap-x-4 gap-y-2 flex-wrap ${isDark ? 'border-gray-100/20' : 'border-gray-200'}`}>
                        {countProblems.map((item, index) => (
                            <NavLink to={`/problem-list/${item?.tags}/`} key={index} className={`flex justify-center items-center hover:text-blue-500 gap-1 rounded-full px-2 py-1 text-sm ${isDark ? 'bg-gray-100/20' : 'bg-gray-200'}`}>
                                <span>{item?.tags.charAt(0).toUpperCase() + item?.tags.slice(1).toLowerCase()}</span>
                                <span className={`ml-1 text-xs ${themeClasses.label}`}>{item?.count}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Search and Filter controls */}
                    <div className='flex w-full items-center justify-between gap-4 flex-wrap'>
                           <div className='flex flex-wrap items-center gap-4 flex-grow'>
                  <label className={`input max-sm:w-75 rounded  items-center gap-2  ${theme == 'dark' ? 'bg-gray-200/10' : 'bg-gray-300'}`}>
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
                  {/* RESPONSIVE: Added flex-shrink-0 to prevent the button from being squished */}
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
                        <div className={`p-2 flex-shrink-0 font-medium ${themeClasses.label}`}>
                            {solvedProblems.length}/{problems.length} Solved
                        </div>
                    </div>
                </div>

                {/* Problems List */}
                <div className="flex flex-col rounded-sm gap-3 justify-center items-center w-full">
                    {filteredProblems.length === 0 && (
                        <div className={`text-center py-10 ${themeClasses.label}`}>
                            <Frown className="mx-auto h-12 w-12" />
                            <p className="mt-2">No problems match your filters.</p>
                        </div>
                    )}
                    {filteredProblems.map((problem, index) =>
                        <div key={problem._id} className={`rounded-lg p-3 w-full transition-colors border ${isDark ? 'bg-gray-100/5 hover:bg-gray-200/10 border-gray-100/30' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'}`}>
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                                <div className="flex items-center gap-4 overflow-hidden w-full sm:w-auto">
                                    <div className="text-green-500 w-4 flex-shrink-0">{solvedProblems.some(sp => sp._id === problem._id) && <Check size={18} />}</div>
                                    <span className='truncate'>{`${index + 1}. `}{problem.title}</span>
                                </div>
                                <div className="flex justify-between items-center gap-4 flex-shrink-0 w-50 self-end sm:self-center">

                                    <div className={`truncate whitespace-nowrap font-semibold ${getDifficultyBadgeColor(problem.difficulty)}`}>{problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1).toLowerCase()}</div>
                                    <div className={`truncate whitespace-nowrap font-medium `}>{problem.tags.charAt(0).toUpperCase() + problem.tags.slice(1).toLowerCase()}</div>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0 self-end sm:self-center">

                                    <button onClick={() => handleUpdateClick(problem._id)} className="btn btn-sm btn-outline btn-info">Update</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
        case 'easy': return 'text-info';
        case 'medium': return 'text-warning';
        case 'hard': return 'text-error';
        default: return 'text-neutral-content';
    }
};

export default AdminProblemUpdate;