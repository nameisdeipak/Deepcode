

import React, { useState ,useEffect} from 'react';
import {
  Plus, Edit, Menu, Code,
  Trash2, BookMarkedIcon,
  Moon, Sun, Home, Puzzle,
  RefreshCw, Zap,
  PanelRightClose,
  PanelRightOpen,
  Video, Palette, LogOut,
  Check, User, Settings,ShieldUser,CodeXmlIcon
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { useSelector, useDispatch } from "react-redux";
import { toast, Toaster } from 'react-hot-toast';
import { logoutUser, clearLoginSuccess, themeChanger, sidebarSet } from '../authSlice';

const navLinks = [
  { to: "/admin-panel", text: "Dhashboard", icon: <Home size={20} /> },
  { to: "/admin/all-users", text: "User's", icon: <User size={20} /> },
  { to: "/admin/signup", text: "Admin Signup", icon: <ShieldUser size={20} /> },
  { to: "/admin/all-problems", text: "Problems", icon: <CodeXmlIcon size={20} /> },
  { to: "/admin/all-courses", text: "Courses", icon: <BookMarkedIcon size={20} /> },
  { to: "/admin/all-problem/vidoes", text: "Problem's Videos", icon: <Video size={20} /> },
  { to: "/admin-Profile", text: "Setting", icon: <Settings size={20} /> },
];

function AdminSidebar() {

    const dispatch=useDispatch();
  const activeLinkClass = "text-primary font-semibold";
  const baseLinkClass = "hover:text-primary transition-colors duration-200";
  const { user, theme, sideBar } = useSelector(state => state.auth);



  return (
    <>

       {sideBar && <div className="fixed inset-0 z-10 bg-black/50  md:hidden"></div>}

      <div className={` z-10 
        ${sideBar ? 'w-xs ' : 'w-20'}
        ${theme == 'dark' ? 'bg-gray-100/5 text-gray-300 ' : 'bg-white text-black shadow '}
        flex flex-col gap-6 px-4 min-h-screen
        transition-all duration-300 ease-in-out overflow-x-hidden
      `}>

        <div className={`flex justify-start items-center w-full gap-4 mt-5 ${theme=='dark'?'text-white':'text-black'}`}>
          <div className="avatar flex-shrink-0"> 
            <div className="rounded-full ring-1 shadow-black ring-black w-10">
              <img src={`${(user?.profile?.profile_url) ? (user?.profile?.profile_url) : (`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`)}`} />
            </div>
          </div>


          {sideBar && (
            <div className={`text-sm flex flex-col whitespace-nowrap `}>
              <span className="text-sm font-medium">
                {user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1).toLowerCase()} {user?.lastName?.charAt(0).toUpperCase() + user?.lastName?.slice(1).toLowerCase()}
              </span>
              <span className='text-gray-500'>Admin</span>
            </div>
          )}
        </div>

        {/* menus */}
        <div className={` flex flex-col gap-6 w-full mt-4`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              
              className={({ isActive }) => `flex items-center  ${sideBar ?'':'justify-center'} w-auto gap-6 p-2  rounded-sm text-sm whitespace-nowrap ${baseLinkClass} ${isActive ? 'bg-primary/10 ' + activeLinkClass : ''}`}
            >
              {link.icon}
           
              {sideBar && <span  className=' truncate text-nowrap max-sm:hidden'>{link.text}</span>}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}

export default AdminSidebar;

