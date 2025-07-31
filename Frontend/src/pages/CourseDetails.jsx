import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { ArrowBigLeft } from "lucide-react";
import { useSelector } from "react-redux";


const CourseDetail = () => {
    const { courseId } = useParams();

    const [courseData, setCourseData] = useState(null);
    const [IsLoading, setIsLoading] = useState(false);
    const { theme } = useSelector((state) => state.auth);


    const fetchCourseData = async () => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`/course/CourseById/${courseId}`);
            setCourseData(response?.data);
            setIsLoading(false)
        } catch (error) {
            alert("Can't get courese");
        }
    }

    useEffect(() => {
        fetchCourseData();
    }, [courseId])


    if (IsLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <span className="loading loading-bars loading-xs"></span>
            <span className="loading loading-bars loading-sm"></span>
            <span className="loading loading-bars loading-md"></span>
            <span className="loading loading-bars loading-lg"></span>
            <span className="loading loading-bars loading-xl"></span>
        </div>;
    }


    return (
        < >
            <Header />

        

            {/* main content */}
            <div className={`min-h-screen ${theme == 'light' ? 'bg-white-400' : 'bg-black'} p-6`}>

                {/* course image and course card section */}
                <div className={`  max-w-6xl mx-auto flex flex-row max-lg:flex-col gap-8 items-center mb-12 rounded-xl ${theme == 'light' ? 'glass' : 'bg-gray-100/0 border-gray-100/10 '} border   p-5`}>
                    <div className="w-full">
                        <img
                            src={courseData?.image.url}
                            alt={courseData?.title}
                            className="rounded-lg shadow-2xl w-full max-h-96 object-cover"
                        />
                    </div>
                    <div className="w-full border rounded-xl glass flex flex-col gap-5 border-gray-500  p-4">
                        <div className="badge badge-soft  glass">{courseData?.courseType}</div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-bold">{courseData?.title}</h1>
                            <p className="text-sm opacity-80">{courseData?.subTitle}</p>
                            <p className="text-xs"><span className="text-xl">{courseData?.chapters.length}</span> Chapters</p>

                        </div>

                        <div className="flex gap-4 items-center">
                            <span className="text-xl font-medium">
                                {courseData?.price > 0 ? `$${courseData?.price}` : "Free"}
                            </span>
                            {courseData?.premium && (
                                <span className="badge badge-warning">Premium</span>
                            )}


                        </div>
                        <a
                            href={courseData?.courseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm w-4/15"
                        >
                            Start Learning
                        </a>
                    </div>
                </div>

                {/* course overview and course descripton section */}
                <div className="max-w-6xl  flex  justify-between flex-row-reverse max-lg:gap-10 max-lg:flex-col-reverse mx-auto   ">
                    {/* Course Descriptions */}
                    <div className="flex flex-col w-2xl  gap-2 max-lg:w-full   h-full  ">
                        {courseData?.descriptions?.map((desc) => (
                            <div key={desc?._id} className=" card h-auto bg-gray-400/10   ">
                                <div className="card-body    rounded-xl">
                                    <h2 className={`card-title  text-2xl ${theme == 'light' ? 'text-black' : 'text-white'} `}>{desc?.descriptionTitle}</h2>
                                    <p className={` ${theme == 'light' ? 'text-gray-700' : 'text-gray-400'} `}>{desc?.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Course Chapters */}
                    <div className="w-100 max-lg:w-full  glass shadow-lg rounded-lg overflow-hidden">
                        {/* black Section */}
                        <div className="bg-neutral text-neutral-content p-5">
                            <div className="flex items-center gap-3">
                                {/* <ClipboardDocumentListIcon className="h-7 w-7" /> */}
                                <h2 className="text-xl font-bold">Overview</h2>
                            </div>
                            <p className="text-sm mt-2 text-neutral-content/80">
                                In this video-based course, we will take you on a journey to learn the Fundamentals .
                            </p>
                        </div>
                        {/* List of chapters and chapters details  Course Items */}
                        <div className="divide-y divide-base-200">
                            {courseData?.chapters.map((chapter, index) => (
                                <div key={chapter?._id} className="flex items-start space-x-4 p-4 hover:bg-base-200 cursor-pointer transition-colors duration-200">
                                    {/* The empty circle on the left */}
                                    <div className="mt-1 h-5 w-5 flex-shrink-0 rounded-full border-2 border-base-300"></div>

                                    {/* Title and Description */}
                                    <div>
                                        <h3 className="font-semibold text-base-content">{chapter?.chapterName}</h3>
                                        {chapter?.chapterDetails && <p className="text-sm text-base-content/70 mt-1">{chapter?.chapterDetails}</p>}
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                </div>
                {/* kya shikhonge wo section  */}
                <div className="max-w-6xl   mx-auto space-y-12 mt-6">
                    {/* Course Highlights */}
                    <div className={`card ${theme === 'light' ? 'bg-primary' : 'bg-gray-400/10'} text-primary-content `}>
                        <div className="card-body">
                            <h2 className="card-title text-3xl">What You'll Learn</h2>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                {courseData?.chapters?.map((item, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>{item?.chapterName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

       
                    <div className="text-sm text-gray-500 text-center">
                        Course published on: {new Date(courseData?.createdAt).toLocaleDateString()}
                    </div>
                </div>

            </div>

            <Footer />
        </>
    );;
};

export default CourseDetail;