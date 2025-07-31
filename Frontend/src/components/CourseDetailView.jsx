import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BookOpen, List, ExternalLink, Tag } from 'lucide-react';
import { NavLink } from 'react-router';
import { useParams } from 'react-router';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import axiosClient from '../utils/axiosClient';
import { TriangleAlert, ArrowLeft } from 'lucide-react';


function CourseDetailView() {
    const { courseId } = useParams();
    const { theme } = useSelector(state => state.auth);
    const [courseData, setCoursesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);



    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);






    useEffect(() => {
        const fetchCourseData = async () => {
            setIsLoading(true);
            try {
                const response = await axiosClient.get(`/course/CourseById/${courseId}`);
                setCoursesData(response?.data);
            } catch (err) {

                toast.error('Failed to fetch course data.');

            } finally {
                setIsLoading(false);
            }
        };
        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

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
        page: isDark ? 'bg-black border-gray-100/10 border text-gray-300' : 'shadow  text-gray-900',
        card: isDark ? 'bg-gray-100/4 border border-gray-100/10' : 'bg-white border border-gray-200',
        title: isDark ? 'text-white' : 'text-gray-900',
        subtitle: isDark ? 'text-gray-400' : 'text-gray-600',
        accordion: isDark ? 'bg-gray-100/5' : 'bg-gray-100',
        accordionHover: isDark ? 'hover:bg-gray-100/20' : 'hover:bg-gray-200',
        divider: isDark ? 'border-gray-700' : 'border-gray-200',
        modalBox: isDark ? 'bg-black border border-gray-100/20 text-white' : 'bg-white text-black',
    };


    const isFree = !courseData?.premium || courseData?.price === 0;

    if (isLoading) return (
      

        <div className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} min-h-screen`}>
            <AdminHeader openTab={`Problem's Video's`} />
            <div className='flex'>
                <AdminSidebar />

                <div className='flex-grow p-2 sm:p-4 md:p-6 lg:p-8'>
                    <div className="container max-w-5xl mx-auto animate-pulse bg-gray-200/30 p-4">


                        <div className='animate-pulse bg-gray-300/30 px-12 py-7 mx-auto mt-4  ' ></div>

                        <div className={` mt-5 py-80 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>



                        </div>
                   


                    </div>

                </div>

            </div>
        </div>
     
    )


    return (

        <>
            <div className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} min-h-screen`}>
                <AdminHeader openTab={`Course Details`} />
                <div className='flex'>
                    <AdminSidebar />
                    <div className={`min-h-screen w-full mx-auto mt-5 mb-5 max-w-5xl p-4  rounded  ${themeClasses.page} font-sans`}>

                        <div className={`   top-19 py-2 z-10  px-2 rounded card-actions flex justify-between ${themeClasses.card}  items-center gap-2`}>


                            <div className="s flex justify-start  items-center gap-2">
                                <button type="button" className="btn btn-ghost hover:btn-outline hover:text-white transition-all duration-500" onClick={() => window.history.back()}><ArrowLeft className="h-4 w-4 mr-2" /> Back</button>
                            </div>
                            <div className=" flex justify-start  items-center gap-2">
                                <NavLink to={`/admin/update-course/${courseData?._id}`} className='btn btn-sm btn-primary btn-outline '>Update</NavLink>
                                <button className='btn btn-sm btn-error btn-outline' onClick={() => handleOpenModal(courseData)}>Delete</button>
                            </div>

                        </div>

                        <div className="container mx-auto  p-4 sm:p-6 lg:p-8">

                            {/* Main Grid Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">

                                {/* Left Column: Main Content */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Course Header */}
                                    <header className="space-y-4">
                                        <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight ${themeClasses.title}`}>
                                            {courseData?.title}
                                        </h1>
                                        <p className={`text-lg md:text-xl ${themeClasses.subtitle}`}>
                                            {courseData?.subTitle}
                                        </p>
                                    </header>

                                  
                                    <div className={` block lg:hidden card shadow ${themeClasses.card}`}>
                                        <figure>
                                            <img src={courseData?.image?.url} alt={courseData?.title} className="w-full h-auto object-cover" />
                                        </figure>
                                        <div className="card-body">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className={`card-title text-3xl font-bold ${themeClasses.title}`}>
                                                    {isFree ? 'Free' : `₹${courseData?.price}`}
                                                </h2>
                                              
                                                {courseData?.courseType && <div className="badge badge-primary capitalize">{courseData?.courseType}</div>}
                                            </div>

                                            <div className="card-actions justify-center">
                                                <a href={courseData?.courseUrl} target="_blank" rel="noopener noreferrer" className="btn  btn-lg sm:btn-sm btn-primary btn-block text-lg">
                                                    {isFree ? 'Start Learning' : 'Enroll Now'}
                                                    <ExternalLink className="w-5 h-5 ml-2" />
                                                </a>
                                            </div>

                                            <div className={`divider my-4 ${themeClasses.divider}`}></div>

                                            <div className="space-y-2 text-sm">
                                                <h3 className="font-bold text-base mb-2">This course includes:</h3>
                                                <p className="flex items-center gap-3"><List className="w-4 h-4 text-primary" /> {courseData?.chapters?.length} chapters</p>
                                                <p className="flex items-center gap-3"><BookOpen className="w-4 h-4 text-primary" /> {courseData?.descriptions?.length} detailed sections</p>
                                                <p className="flex items-center gap-3"><Tag className="w-4 h-4 text-primary" /> Full lifetime access</p>
                                            </div>
                                        </div>
                                    </div>



                                    {/* Course Descriptions */}
                                    <section className="space-y-6">
                                        <h2 className={`text-2xl font-bold flex items-center gap-3 ${themeClasses.title}`}>
                                            <BookOpen className="w-6 h-6 text-primary" />
                                            About This Course
                                        </h2>
                                        {courseData?.descriptions?.map((desc) => (
                                            <div key={desc._id}>
                                                <h3 className="text-xl font-semibold mb-2">{desc.descriptionTitle}</h3>
                                                <p className={`leading-relaxed ${themeClasses.subtitle}`}>
                                                    {desc.description}
                                                </p>
                                            </div>
                                        ))}
                                    </section>

                                    <div className={`divider ${themeClasses.divider}`}></div>

                                    {/* Chapters Accordion */}
                                    <section className="space-y-4">
                                        <h2 className={`text-2xl font-bold flex items-center gap-3 ${themeClasses.title}`}>
                                            <List className="w-6 h-6 text-primary" />
                                            What You'll Learn
                                        </h2>
                                        <div className="space-y-2">
                                            {courseData?.chapters?.map((chapter, index) => (
                                                <div key={chapter._id} className={`collapse collapse-arrow rounded-lg ${themeClasses.accordion} ${themeClasses.accordionHover}`}>
                                                    <input type="checkbox" className="peer" />
                                                    <div className="collapse-title text-lg font-medium peer-checked:bg-primary/10">
                                                        <span className="font-bold mr-3">Chapter {index + 1}:</span> {chapter.chapterName}
                                                    </div>
                                                    <div className="collapse-content peer-checked:bg-primary/5">
                                                        <p className="p-4 !pt-2 text-base">
                                                            {chapter.chapterDetails}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column: Sticky Card */}
                                <div className="hidden lg:block">
                                    <div className="lg:sticky lg:top-8 space-y-6">
                                        <div className={`card shadow-xl ${themeClasses.card}`}>
                                            <figure>
                                                <img src={courseData?.image?.url} alt={courseData?.title} className="w-full h-auto object-cover" />
                                            </figure>
                                            <div className="card-body">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h2 className={`card-title text-3xl font-bold ${themeClasses.title}`}>
                                                        {isFree ? 'Free' : `₹${courseData?.price}`}
                                                    </h2>
                                                    {isFree && <div className="badge badge-success badge-lg font-bold text-white">FREE</div>}
                                                    {courseData?.courseType && <div className="badge badge-primary capitalize">{courseData?.courseType}</div>}
                                                </div>

                                                <div className="card-actions justify-center">
                                                    <a href={courseData?.courseUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block text-lg">
                                                        {isFree ? 'Start Learning' : 'Enroll Now'}
                                                        <ExternalLink className="w-5 h-5 ml-2" />
                                                    </a>
                                                </div>

                                                <div className={`divider my-4 ${themeClasses.divider}`}></div>

                                                <div className="space-y-2 text-sm">
                                                    <h3 className="font-bold text-base mb-2">This course includes:</h3>
                                                    <p className="flex items-center gap-3"><List className="w-4 h-4 text-primary" /> {courseData?.chapters?.length} chapters</p>
                                                    <p className="flex items-center gap-3"><BookOpen className="w-4 h-4 text-primary" /> {courseData?.descriptions?.length} detailed sections</p>
                                                    <p className="flex items-center gap-3"><Tag className="w-4 h-4 text-primary" /> Full lifetime access</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    

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
                            
                            Delete Course
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseDetailView;