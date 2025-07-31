import React, { useState, useRef, useEffect } from 'react';
import CourseCard from './CourseCard';
import axiosClient from '../utils/axiosClient';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { ShimmerCoursel } from "../components/ShimmerCoursel"
import DeepcodeLoader from './DeepcodeLoader';
import { Play, ArrowLeft, ArrowRight } from 'lucide-react';

const CourseCarousel = () => {
  const { user,theme } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourse] = useState([]);
  const sliderRefs = useRef({});
  const coursetype = ['feature', 'learn', 'interview'];

  const scrollLeft = (type) => {
    if (sliderRefs.current[type]) {
      sliderRefs.current[type].scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = (type) => {
    if (sliderRefs.current[type]) {
      sliderRefs.current[type].scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  const fetchCourse = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get("/course/getAllCourses");
      setCourse(response?.data?.getAllCourse);

      setIsLoading(false);

    } catch (error) {
      alert(error.response?.data?.message || 'Error creating course');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [user]);

  if (isLoading) {
    return (
      <DeepcodeLoader/>
    )
  }


  return (
    <div className="w-full  max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative">
      {coursetype.map((type) => {

        if (!sliderRefs.current[type]) {
          sliderRefs.current[type] = React.createRef();
        }

        const coursesForType = courseData.filter(course => course?.courseType === type);


        if (coursesForType.length === 0) return null;

        
  const themeClasses = {
    bg: theme === 'dark' ? 'bg-black' : 'bg-white',
    sectionBg: theme === 'dark' ? 'bg-gray-900/40' : 'bg-slate-50',
    cardBg: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    accent: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
    border: theme === 'dark' ? 'border-gray-800' : 'border-gray-200',
  };

        return (
          <div key={type} className="mb-12 ">
            <div className="flex sm:pl-4 flex-col   max-sm:justify-center  items-center mb-6">
        
              <h2 className="text-3xl md:text-4xl mx-auto font-bold tracking-tight capitalize">Courses of  {type}</h2>
            <p className={`mt-4 text-lg  ${themeClasses.textSecondary}`}>
                          Curated courses to boost your skills in the {type} domain.
        </p>
            </div>

            <div className="relative group ">
              <button
                onClick={() => scrollLeft(type)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10  text-black hover:text-white px-6 rounded  bg-white  p-2 shadow-md  hover:bg-gray-500/90 hidden md:group-hover:block"
                aria-label="Scroll left"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>



              <div
                ref={el => sliderRefs.current[type] = el}
                className={`flex px-6  rounded-xl   overflow-x-auto space-x-6  py-5 gap-12  hide-scrollbar scroll-smooth whitespace-nowrap`}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {coursesForType.map(course => (
                  <NavLink 
                    key={course._id}
                    to={`/course/details/${course._id}`}
              
                  >
                  <CourseCard key={course._id} course={course} />
                  </NavLink>
                ))}
              </div>

              <button
                onClick={() => scrollRight(type)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-black hover:text-white px-6 rounded bg-white  p-2 shadow-md  hover:bg-gray-500/90 hidden md:group-hover:block"
                aria-label="Scroll right"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CourseCarousel;

