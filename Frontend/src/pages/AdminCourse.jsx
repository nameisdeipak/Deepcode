import React, { useEffect, useState } from 'react';
import { Lock, TriangleAlert } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { useSelector, useDispatch } from "react-redux";
import { toast, Toaster } from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import axiosClient from '../utils/axiosClient';



function AdminCourse() {

    const { user, theme } = useSelector(state => state.auth);
    const [courses, setCourses] = useState([]);
    const [isLoadig, setIsLoading] = useState(false);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);


    useEffect(() => {

        fetchCourses();
    }, []);


    const fetchCourses = async () => {
        setIsLoading(true)
        try {

            const response = await axiosClient.get("/course/getAllCourses");
            setCourses(response?.data?.getAllCourse);
            console.log(response?.data?.getAllCourse);
            setIsLoading(false);


        } catch (error) {
            console.log(error);
            toast.error(error)
        }
    }



    const handleOpenModal = (course) => {
        setCourseToDelete(course);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (isDeleting) return;
        setIsModalOpen(false);
        setCourseToDelete(null);
    };



    const handleConfirmDelete = async () => {
        if (!courseToDelete) return;

        setIsDeleting(true);
        try {
            await axiosClient.delete(`/course/delete/${courseToDelete._id}`);
            setCourses(courses.filter(item => item._id !== courseToDelete._id));
            handleCloseModal();
            toast.success('Successfully Delete Course.');
        } catch (err) {
            toast.error('Failed to delete the course.');
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

    if (isLoadig) {

        return (
            <div className={`${theme == 'dark' ? 'bg-black' : 'bg-white'}`}>
                <AdminHeader openTab={'Dashboard'} />

                <div className='flex  '>
                    <AdminSidebar />





                    <div className=' max-w-5xl mx-auto  w-full min-h-screen p-4  md:p-8  '>

                        <div className='animate-pulse bg-gray-300/30 px-12 py-7 mx-auto mt-4 mb-6 rounded  ' ></div>
                        <div className='animate-pulse bg-gray-300/30 px-4 mx-auto w-25  py-4 mt-4 mb-6 rounded  ' ></div>
                        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-2 w-full mx-auto  text-black  bg-transparent">


                            <div className="card    h-75 animate-pulse bg-gray-300/50"         >          </div>
                            <div className="card    h-75 animate-pulse bg-gray-300/50"         >          </div>
                            <div className="card    h-75 animate-pulse bg-gray-300/50"         >          </div>
                            <div className="card    h-75 animate-pulse bg-gray-300/50"         >          </div>
                            <div className="card    h-75 animate-pulse bg-gray-300/50"         >          </div>
                            <div className="card    h-75 animate-pulse bg-gray-300/50"         >          </div>


                        </div>


                    </div>

                </div>
            </div>


        )
    }





    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className={`${theme == 'dark' ? 'bg-black' : 'bg-white'}`}>
                <AdminHeader openTab={'Courses'} />

                <div className='flex  '>
                    <AdminSidebar />

                    {/* Dashboard  */}

                    <div className={`bg-red-200/0 max-w-5xl mx-auto w-full min-h-screen p-4 ${theme == 'dark' ? 'text-white' : 'text-black'}  md:p-8`}>
                        <div className={`text-center mb-12 `}        >
                            <h1 className=" text-3xl sm:text-4xl font-bold mb-2 ">
                                Courses Management
                            </h1>
                            <p className=" text-md sm:text-lg">
                                Manage Courses   of  your platform
                            </p>
                        </div>

                        <div className='flex gap-4 w-auto mx-auto items-center  justify-center '>

                            <NavLink to={'/admin/course/create'} className='btn btn-sm btn-soft btn-primary border-0 bg-primary/10 hover:bg-primary  '>  Create  New </NavLink>
                        </div>


                        <div className="mb-1 mt-5 mx-auto ">
                            <p className="mt-1 text-center md:text-left  text-sm">
                                A list of all Course's .
                            </p>
                        </div>
                        {/* course show here  */}
                        <div className='grid  grid-cols-1 md:grid-cols-2  lg:grid-cols-3   w-full  flex-wrap gap-12 mt-6'>

                            {
                                courses.map((item, index) => (
                                    <div
                                        key={item?._id}
                                        className={`card mx-auto ${theme == 'light' ? 'shadow-lg' : 'border border-gray-100/20  '}  w-80 shadow-sm rounded-xl inline-flex flex-shrink-0 `}>

                                        <div className='relative h-50 overflow-hidden rounded-xl p-2'>
                                            <img
                                                src={item?.image.url}

                                                className='w-full h-full object-cover rounded-xl'
                                                alt="" />

                                            {(item?.premium === true) && (


                                                <span
                                                    className='absolute top-4 right-4 btn btn-sm btn-circle p-2 btn-warning border-warning'><Lock />
                                                </span>
                                            )}
                                        </div>
                                        <div className="card-body gap-2 p-4">
                                            <h2 className="card-title flex justify-between">
                                                {item?.title}
                                                <div className="badge border-0 rounded bg-black/10 text-black/50 font-normal">{item?.courseType}</div>
                                            </h2>
                                            <p className='truncate'>{item?.subTitle}</p>
                                            <div className='flex justify-between items-center'>
                                                <div className="flex justify-between gap-4 items-center text-center text-gray-600">

                                                    <div className='flex  gap-2 justify-center items-center'>
                                                        <p className="text-xs">Chapters : </p>
                                                        <p className="font-bold text-sm text-base-400">{item?.chapters.length}</p>
                                                    </div>

                                                    {(item?.premium === true) && (
                                                        <div className='flex  gap-2 justify-center items-center'>
                                                            <p className="text-xs">Paid : </p>
                                                            <p className="font-bold text-sm text-base-400">{item?.price}</p>
                                                        </div>
                                                    )}

                                                </div>

                                            </div>
                                            <div className="card-actions items-center gap-2">
                                                <NavLink to={`/admin/cousre/details/${item?._id}`} className='btn btn-sm btn-info   ' >View</NavLink>
                                                <NavLink to={`/admin/update-course/${item?._id}`} className='btn btn-sm btn-primary '>Update</NavLink>
                                                <button className='btn btn-sm btn-error' onClick={() => handleOpenModal(item)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>


            <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
                <div className={`modal-box ${themeClasses.modalBox}`}>
                    <div className="flex flex-col items-center justify-center  gap-4">
                        <TriangleAlert size={50} color={'red'} />
                        <div>
                            <h3 className="font-bold text-lg text-center">Confirm Deletion</h3>
                            <p className="py-4 text-center">
                                Are you sure you want to delete the Course "<strong>{courseToDelete?.title}</strong>"? This action cannot be undone.
                            </p>
                        </div>
                        {isDeleting && <span className="loading loading-spinner loading-md mx-auto mt-4"></span>}
                    </div>
                    <div className="modal-action justify-center">
                        <button onClick={handleCloseModal} className="btn btn-ghost" disabled={isDeleting}>Cancel</button>
                        <button onClick={handleConfirmDelete} className="btn btn-error" disabled={isDeleting}>
                            {/* {isDeleting ? <span className="loading loading-spinner loading-md"></span> : ' Delete Course'} */}
                            Delete Course
                        </button>
                    </div>
                </div>
            </div>


        </>
    )

}

export default AdminCourse;