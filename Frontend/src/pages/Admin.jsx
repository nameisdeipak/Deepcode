import React, { useEffect, useState } from 'react';
import {
  Plus, Edit, Menu, Code,
  Trash2, BookMarkedIcon,
  Moon, Sun, Home, Puzzle,
  RefreshCw, Zap,
  PanelRightClose,
  PanelRightOpen,
  Video, Palette, LogOut,
  Check, User, Settings,
  Code2Icon
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { useSelector, useDispatch } from "react-redux";
import { toast, Toaster } from 'react-hot-toast';
import { logoutUser, clearLoginSuccess, themeChanger } from '../authSlice';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import axiosClient from '../utils/axiosClient';




const DashboardData = [
  {
    id: 'user',
    title: `Total User's`,
    description: 'Add a new coding problem to the platform',
    icon: User,
    color: 'btn-success',
    bgColor: 'bg-success/10',
    route: '/admin/all-users'
  },
  {
    id: 'courses',
    title: `Total Course's`,
    description: 'Add a new coding problem to the platform',
    icon: BookMarkedIcon,
    color: 'btn-warning',
    bgColor: 'bg-warning/10',
    route: '/admin/all-courses'
  },
  {
    id: 'probem',
    title: `Total Coding Problem's`,
    description: 'Add a new coding problem to the platform',
    icon: Code2Icon,
    color: 'btn-info',
    bgColor: 'bg-info/10',
    route: '/admin/all-problems'
  },
  {
    id: 'Videos',
    title: `Total Problem's video's`,
    description: 'Add a new coding problem to the platform',
    icon: Video,
    color: 'btn-error',
    bgColor: 'bg-error/10',
    route: '/admin/all-problem/vidoes'
  },


]





function Admin() {

  const { user, theme } = useSelector(state => state.auth);
  const [data, setData] = useState([]);
  const [isLoadig, setIsLoading] = useState(false);


  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await axiosClient.get(`/admin/dashboard/data`);
        setData(response?.data?.result);
        setIsLoading(false)
        console.log(response.data.result);
      } catch (error) {
        toast.error('Error fetching Data:', error);
      }
    };

    fetchData();
  }, [])

  if (isLoadig) {

    return (
      <div className={`${theme == 'dark' ? 'bg-black' : 'bg-white'}`}>
        <AdminHeader openTab={'Dashboard'} />

        <div className='flex  '>
          <AdminSidebar />

          {/* Dashboard  */}



          <div className=' max-w-5xl mx-auto  w-full min-h-screen p-4  md:p-8  '>

            <div className='animate-pulse bg-gray-300/30 px-12 py-7 mx-auto mt-4 mb-6 rounded  ' ></div>
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mx-auto  text-black  bg-transparent">


              <div className="card    h-50 animate-pulse bg-gray-300/50"         >          </div>
              <div className="card    h-50 animate-pulse bg-gray-300/50"         >          </div>
              <div className="card    h-50 animate-pulse bg-gray-300/50"         >          </div>
              <div className="card    h-50 animate-pulse bg-gray-300/50"         >          </div>
              <div className="card    h-50 animate-pulse bg-gray-300/50"         >          </div>
              <div className="card    h-50 animate-pulse bg-gray-300/50"         >          </div>


            </div>


          </div>

        </div>
      </div>


    )
  }






  const isDark = theme === 'dark';
  const themeClasses = {
    card: isDark ? 'bg-black border-gray-100/10 text-gray-100' : 'bg-white border-gray-200 text-black',
    container: isDark ? 'bg-gray-100/5 border-gray-100/20' : 'bg-white border-gray-200',

  };


  return (
    <div className={`${theme == 'dark' ? 'bg-black' : 'bg-white'}`}>
      <AdminHeader openTab={'Dashboard'} />

      <div className='flex  '>
        <AdminSidebar />

        {/* Dashboard  */}
        <div className='bg-red-200/0 max-w-5xl mx-auto w-full min-h-screen p-4  md:p-8'>

          <div
            className={`text-center mb-12 ${theme == 'dark' ? 'text-white' : 'text-black'}`}
          >
            <h1 className=" text-3xl sm:text-4xl font-semibold mb-4 ">
              DashBoard
            </h1>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto text-black">

            {

              DashboardData.map((option, index) => {
                const IconComponent = option.icon;
                return (


                  <div
                    key={option.id}
                    className={`  card   shadow ${themeClasses.card} border hover:shadow transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
                  >
                    <div className="card-body items-center text-center p-4 px-2">
                      {/* Icon */}
                      <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
                        <IconComponent size={50} className="" />
                      </div>

                      {/* Title */}
                      <h2 className="card-title text-xl mb-2">
                        {option.title}
                      </h2>

                      {/* Description */}
                      <p className="text-xl mb-6">
                        {data[index]}
                      </p>
                      <NavLink to={option.route}
                        className="btn  btn-sm btn-outline btn-primary "

                      >
                        More Details

                      </NavLink>

                    </div>
                  </div>

                )


              })
            }

          </div>


        </div>

      </div>
    </div>
  )

}

export default Admin;