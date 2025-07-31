
import React, { useEffect, useRef, useCallback, useState } from 'react';
import {

    TriangleAlert, UserCircle2,
    X, UserCircle, Mail, Fingerprint, CalendarDays
} from 'lucide-react';
import { useSelector } from "react-redux";
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import axiosClient from '../utils/axiosClient';
import { toast, Toaster } from 'react-hot-toast';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


function AdminUsers() {
    const { theme } = useSelector(state => state.auth);

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [TotalUsers, setTotalUsers] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const [selectedUser, setSelectedUser] = useState(null);


    const observer = useRef();
    const loaderRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const fetchUsers = useCallback(async (isNewSearch = false) => {
        if (loading) return;
        setLoading(true);

        const pageToFetch = isNewSearch ? 1 : page;


        try {
            const response = await axiosClient.get(`/admin/user's?page=${pageToFetch}&limit=7&search=${debouncedSearchQuery}`);
            const { users: newUsers, totalPages } = response.data;

            setUsers(prev => (pageToFetch === 1 ? newUsers : [...prev, ...newUsers]));
            setHasMore(response.data.currentPage < totalPages);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            if (error.response && error.response.status === 404) {
                setUsers([]);
                setHasMore(false);
            }
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearchQuery, loading, hasMore]);



    useEffect(() => {
        setUsers([]);
        setPage(1);
        setHasMore(true);
        fetchUsers(true);
    }, [debouncedSearchQuery]);


    useEffect(() => {
        if (page > 1) {
            fetchUsers();
        }
    }, [page]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get(`/admin/dashboard/data`);
                setTotalUsers(response?.data?.result[0]);
            } catch (error) {
                toast.error('Error fetching Data:', error);
            }
        }
        fetchData();
    }, [])



    // Function to open the details modal
    const openDetailsModal = (user) => {
        setSelectedUser(user);
        document.getElementById('details_user_modal').showModal();
    };

    // Function to open the delete confirmation modal
    const openDeleteModal = (user) => {
        setSelectedUser(user);
        document.getElementById('delete_user_modal').showModal();
    };

    const confirmDelete = async () => {
        if (!selectedUser) return;

        try {
            const response = await axiosClient.delete(`/admin/delete/user/${selectedUser._id}`);
            setUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
            toast.success("Delete successful " + selectedUser?.userName);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred during deletion.";
            toast.error(errorMessage);
            console.error("Deletion error:", err);
        } finally {
            document.getElementById('delete_user_modal').close();
            setSelectedUser(null);
        }
    };

    if (loading && page == 1) return (

        <div className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} min-h-screen`}>
            <AdminHeader openTab={`Problem's Video's`} />
            <div className='flex'>
                <AdminSidebar />

                <div className='flex-grow p-2 sm:p-4 md:p-6 lg:p-8'>
                    <div className="container max-w-5xl mx-auto">


                        <div className='animate-pulse bg-gray-300/30 px-12 py-7 mx-auto mt-4  ' ></div>



                        <div className="hidden md:grid justify-start md:grid-cols-12 gap-4 px-12 p-6 font-medium text-xs uppercase">
                            <div className="col-span-1 animate-pulse bg-gray-300/50"></div>
                            <div className="col-span-4 animate-pulse bg-gray-300/50"></div>
                            <div className="col-span-2 p-4 animate-pulse bg-gray-300/50"></div>
                            <div className="col-span-2 p-4 animate-pulse bg-gray-300/50"></div>
                            <div className="col-span-3 text-center p-4 animate-pulse bg-gray-300/50"> </div>
                        </div>

                        <div className={`py-8 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>   </div>
                        <div className={`py-8 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>   </div>
                        <div className={`py-8 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>   </div>
                        <div className={`py-8 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>   </div>
                        <div className={`py-8 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>   </div>
                        <div className={`py-8 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>   </div>
                        <div className={`py-8 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>   </div>
                        <div className={`py-8 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>   </div>

                    </div>

                </div>

            </div>
        </div>
    )



    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
                <AdminHeader openTab={`User's`} />
                <div className='flex'>
                    <AdminSidebar />
                    <div className={`  max-w-5xl mx-auto w-full min-h-screen p-2 md:p-8 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        <div className='w-full  pb-2'>
                            <div className="text-center ">
                                <h1 className=" text-2xl sm:text-4xl font-semibold mb-4">
                                    Users Management
                                </h1>
                                <p className=" text-md sm:text-lg">
                                    Manage User's
                                </p>
                            </div>
                        </div>

                        <div className='flex  justify-between items-center flex-wrap max-sm:justify-center max-sm:gap-4 pr-5 w-full py-2'>
                            <label className={`input rounded border-0 mt-4 ${theme === 'dark' ? 'bg-gray-300/20 ' : ' bg-gray-200 '} `}>
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g>
                                </svg>

                                <input
                                    type="search"
                                    className={`grow  ${theme === 'dark' ? 'text-gray-200' : 'text-black'}`}
                                    placeholder="Search by name, username, or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </label>
                            <span className='text-md text-gray-500'>Total: {TotalUsers}</span>
                        </div>

                        <div className="max-w-full mx-auto p-1">
                            <div className="mb-2">
                                <p className="mt-1 text-sm max-sm:text-center">
                                    A list of all the users in your account.
                                </p>
                            </div>
                            <div className={` overflow-hidden rounded border-0  border-gray-200  ${theme === 'dark' ? 'text-gray-400 bg-gray-100/0 border-0 shadow' : 'text-black'}`}>
                                <div className={`hidden md:grid md:grid-cols-12 px-6 py-2 border-b  border-gray-300/30   ${theme === 'dark' ? 'text-gray-400 bg-gray-100/5' : ' bg-gray-200 text-black'}`}>
                                    <div className="col-span-4 text-sm font-semibold uppercase tracking-wider  ">User</div>
                                    <div className="col-span-3  text-sm font-semibold uppercase tracking-wider   ">Email</div>
                                    <div className="col-span-3 bg-amber-40/0 text-sm font-semibold uppercase tracking-wider  text-center  ">Role</div>
                                    <div className="col-span-2 bg-amber-40/0 text-sm font-semibold uppercase tracking-wider  text-center ">Action</div>
                                </div>
                                <div className="divide-y mt-4   flex flex-col gap-4  transition-all duration-300 ease-in-out overflow-x-hidden">
                                    {users.map((user) => (
                                        <div key={user._id} className={` border border-gray-300/30   rounded grid  grid-cols-1 md:grid-cols-12 items-center py-2 px-4  transition-colors duration-200 ${theme === 'dark' ? 'hover:bg-black' : 'hover:bg-gray-300/30'}`}>
                                            <div className="col-span-12 md:col-span-4 flex items-center gap-4 ">
                                                <img
                                                    src={user?.profile?.profile_url || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`}
                                                    alt={`${user?.userName}'s profile`}
                                                    className="h-12 w-12 rounded-full object-cover"
                                                />
                                                <div>
                                                    <div className="font-semibold ">{`${user?.firstName} ${user?.lastName}`}</div>
                                                    <div className="text-sm text-gray-500">{user.userName}</div>
                                                </div>
                                            </div>
                                            <div className="col-span-12 md:col-span-3 mt-4 text-left  md:mt-0">

                                                <p>  <span className=' inline md:hidden '>Email : </span>  <span className=' '>{user.emailId}</span></p>
                                            </div>
                                            <div className="col-span-12 md:col-span-3 mt-4 md:mt-0  md:text-center ">
                                                <p>  <span className=' inline md:hidden'>Role : </span>  <span className=' capitalize'>{user.role}</span></p>
                                            </div>
                                            <div className="col-span-12 md:col-span-2 mt-4 md:mt-0 flex justify-start gap-4 md:mx-auto">
                                            
                                                <button
                                                    onClick={() => openDetailsModal(user)}
                                                    className="btn btn-sm btn-primary btn-outline"
                                                >
                                                    Details
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(user)}
                                                    className="btn btn-sm btn-error btn-outline"
                                                >
                                                    Delete
                                                </button>
                                     
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div ref={loaderRef} className="flex justify-center items-center h-24">
                                {loading && <span className="loading loading-dots loading-lg"></span>}
                                {!loading && !hasMore && users.length > 0 && (
                                    <p className="text-gray-500">You've reached the end of the list.</p>
                                )}
                                {!loading && users.length === 0 && searchQuery && (
                                    <p className="text-gray-500">No users found for "{searchQuery}".</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>



                {/* Details Modal */}
                <dialog id="details_user_modal" className="modal modal-bottom sm:modal-middle">

                    <div className={`modal-box max-w-md ${theme === 'dark' ? 'bg-black border border-gray-200/30 text-gray-200' : 'bg-white text-gray-800'}`}>

                        {/* --- Modal Header --- */}
                        <div className={`flex justify-between items-center pb-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className='flex items-center gap-2'>
                                <UserCircle className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} size={24} />
                                <h3 className="font-bold text-lg">User Profile</h3>
                            </div>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setSelectedUser(null)}>
                                    <X size={20} />
                                </button>
                            </form>
                        </div>

                        {/* --- Modal Content --- */}
                        {selectedUser && (
                            <div className="pt-6 text-center">
                                {/* --- Profile Picture & Main Info --- */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="avatar">
                                        <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img
                                                src={selectedUser.profile?.profile_url || `https://ui-avatars.com/api/?name=${selectedUser.firstName}+${selectedUser.lastName}&background=random`}
                                                alt={`${selectedUser.userName}'s profile`}
                                            />
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-semibold mt-3">{`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`}</h2>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>@{selectedUser.userName}</p>
                                </div>

                                {/* --- Separator --- */}
                                <div className={`divider my-6 ${theme === 'dark' ? 'divider-neutral' : ''}`}>Details</div>

                                {/* --- Detailed Information List --- */}
                                <ul className="space-y-4 text-left">
                                    <li className="flex items-start gap-4">
                                        <Mail className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} size={20} />
                                        <div>
                                            <span className={`block text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Email Address</span>
                                            <span className="font-medium">{selectedUser.emailId}</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <Fingerprint className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} size={20} />
                                        <div>
                                            <span className={`block text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>User ID</span>
                                            <span className="font-mono text-sm">{selectedUser._id}</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <UserCircle2 className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} size={20} />
                                        <div>
                                            <span className={`block text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>User Role</span>
                                            <span className="font-mono text-sm capitalize">{selectedUser.role}</span>
                                        </div>
                                    </li>
                                    {selectedUser.createdAt && (
                                        <li className="flex items-start gap-4">
                                            <CalendarDays className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} size={20} />
                                            <div>
                                                <span className={`block text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Joined On</span>
                                                <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* --- Modal Actions / Footer --- */}
                        <div className="modal-action mt-6">
                            <form method="dialog">
                                <button className="btn btn-outline w-full" onClick={() => setSelectedUser(null)}>Close</button>
                            </form>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setSelectedUser(null)}>close</button>
                    </form>
                </dialog>

                {/* Delete Confirmation Modal */}
                <dialog id="delete_user_modal" className="modal">
                    <div className={`modal-box  ${theme === 'dark' ? 'bg-black border border-gray-100/20 text-white' : 'bg-white text-black'}`}>
                        <TriangleAlert className="mx-auto  " size={50} color='red' />
                        <h3 className="font-bold text-lg text-center mt-2">Confirm Deletion</h3>
                        <p className="py-4 text-center">
                            Are you sure you want to delete the user <br />
                            <span className="font-semibold">{selectedUser?.userName}</span>?
                            <br /> This action cannot be undone.
                        </p>
                        <div className="modal-action justify-center">
                            <form method="dialog">
                                <button className="btn btn-outline mr-2" onClick={() => setSelectedUser(null)}>Cancel</button>
                            </form>
                            <button className="btn btn-error" onClick={confirmDelete}>
                                Delete User
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setSelectedUser(null)}>close</button>
                    </form>
                </dialog>

            </div>
        </>
    );
}

export default AdminUsers;