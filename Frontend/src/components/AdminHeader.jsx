import React, { useState } from 'react';
import {Menu,
    Moon, Sun, X,
    PanelRightClose,
    PanelRightOpen,
    Palette, 
    Check, 
      Compass, ListChecks, Trophy, MessageCircle,
    Tv, Store, LogOut, 
    ArrowUpRight ,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { useSelector, useDispatch } from "react-redux";
import { toast, Toaster } from 'react-hot-toast';
import { logoutUser, clearLoginSuccess, themeChanger, sidebarSet } from '../authSlice';


const activeLinkClass = "text-primary font-semibold";
const baseLinkClass = "hover:text-primary transition-colors duration-200";


const navLinks = [
    { to: "/", text: "Explore", icon: <Compass size={20} /> },
    { to: "/problemset", text: "Problems", icon: <ListChecks size={20} /> },
    { to: "/contest", text: "Contest", icon: <Trophy size={20} /> },
    { to: "/discuss", text: "Discuss", icon: <MessageCircle size={20} /> },
    { to: "/interview", text: "Interview", icon: <Tv size={20} /> },
    { to: "/store", text: "Store", icon: <Store size={20} /> },
];  

function AdminHeader({ openTab }) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, theme, sideBar } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleTheme = () => {
        dispatch(themeChanger())
    };

    const handleLogout = () => {
        dispatch(clearLoginSuccess());
        dispatch(logoutUser());

        toast.success(' Logout successful!', {
            duration: 1500,
            style: {
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #34d399',
            },
            iconTheme: {
                primary: '#10b981',
                secondary: '#ecfdf5',
            },
        });

        navigate('/login');

    };
    const handleSidebar = () => {
        dispatch(sidebarSet(!sideBar))
    }


    return (
        <>
            <div className={` sticky top-0 z-40 shadow  w-full    ${theme == 'dark' ? 'text-white bg-black' : 'text-black bg-gray-200'} `}>

                {/* header  */}
                <div className={`w-full flex justify-start items-center gap-8 py-4  px-6
                transition-all duration-300 ease-in-out 
                     ${theme == 'dark' ? "border-b border-gray-200/10" : 'bg-white'}`}>


                    {
                        sideBar ? (

                            <div className='w-sm   flex justify-between items-center  mx-auto border-0 border-green '>

                                <h1 className="text-2xl font-bold text-glitch-hover" data-text="DeepCode">
                                    DeepCode
                                </h1>

                                <span className='text-xs text-gray-500 cursor-pointer' onClick={() => handleSidebar()}><PanelRightOpen size={20} /> </span>

                            </div>

                        ) : (

                            <div className='w-auto   flex justify-start   gap-5 items-center  mx-auto border-b-0 border-gray-200/10 '>

                          

                                <span className='text-xs text-gray-500 cursor-pointer' onClick={() => handleSidebar()}><PanelRightClose size={20} /> </span>

                            </div>
                        )

                    }

                    <div className=' w-full flex justify-between'>
                        <div className='text-md font-medium flex  justify-center items-center gap-8'>
                   
                            <span className='text-md '>{openTab}</span>
                        </div>

                        {!sideBar && (<div className='text-md font-medium flex  justify-center items-center gap-8'>
                       
                            <h1 className="text-2xl font-bold text-glitch-hover block max-sm:hidden" data-text="DeepCode">
                                DeepCode
                            </h1>
                        </div>)}

                        {/* desktop  */}
                        <div className="dropdown dropdown-end hidden md:block">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img alt="User Avatar" src={`${(user?.profile?.profile_url) ? (user?.profile?.profile_url) : (`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`)}`} />
                                </div>
                            </div>
                            <ul tabIndex={0} className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box min-h-50 w-65 ${theme == 'dark' ? 'border border-gray-200/20 bg-black' : 'bg-white shadow'}`}>

                                {/* Profile */}
                                <NavLink to={`/u/${user?.userName}/`} >
                                    <div className='flex mt-1 gap-4  px-2 py-2  w-full  rounded-lg  border-0  glass  border-gray-500 items-center'>
                                        <div className="avatar">
                                            <div className="w-13 rounded-full ">
                                                <img alt="User Avatar" src={`${(user?.profile?.profile_url) ? (user?.profile?.profile_url) : (`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`)}`} />
                                            </div>
                                        </div>
                                        <div className="text-sm self-center-safe  ">
                                            {user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1).toLowerCase()} {user?.lastName?.charAt(0).toUpperCase() + user?.lastName?.slice(1).toLowerCase()}
                                        </div>
                                    </div>
                                </NavLink>

                                <div className="mt-4 pt-2 border-t border-gray-300 space-x-2">





                                    {/* Theme dropdown */}
                                    <div className=' dropdown dropdown-left '>
                                        <div tabIndex={0} role='button' className="flex items-center justify-between p-2 rounded-lg">
                                            <div className={`flex items-center gap-4 text-sm  ${baseLinkClass}`}>
                                                <Palette size={20} /> Appearence
                                            </div>
                                        </div>
                                        <ul tabIndex={0} className={` menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow ${theme == 'dark' ? 'bg-black' : 'shadow bg-white'} rounded-box h-auto gap-1  w-50`}>
                                            <button onClick={toggleTheme}
                                                className={`flex justify-between btn btn-ghost  rounded   ${theme == 'dark' ? ('border-1 border-gray-300') : ('')}`}>
                                                Dark {theme == 'dark' ? (<Check />) : ''}
                                            </button>
                                            <button onClick={toggleTheme}
                                                className={`flex justify-between btn btn-ghost   rounded   ${theme == 'light' ? ('border border-gray-300') : ('')}`}>
                                                Light {theme == 'light' ? (<Check />) : ''}
                                            </button>
                                        </ul>
                                    </div>

                                    {/* logout buttn */}
                                    <NavLink to={'/'}  className={`w-full flex items-center gap-4 p-2 rounded-lg text-sm  ${baseLinkClass}`}>
                                        <ArrowUpRight size={20} /> Leave
                                    </NavLink>
                                    <button onClick={handleLogout} className={`w-full flex items-center gap-4 p-2 rounded-lg text-sm  ${baseLinkClass}`}>
                                        <LogOut size={20} /> Sign Out
                                    </button>
                                </div>
                            </ul>
                        </div>
                        
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(true)} className="btn btn-ghost btn-circle">
                                <Menu size={24} />
                            </button>
                        </div>

                        {/* --- Mobile Sidebar --- */}
                        <div
                            className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                                }`}
                        >
                            {/* Overlay */}
                            <div
                                className="absolute inset-0 bg-black/50"
                                onClick={() => setIsMenuOpen(false)}
                            ></div>

                            {/* Sidebar Content */}
                            <div className={`relative ml-auto h-full overflow-y-auto w-4/6 max-sm:w-full ${theme == 'dark' ? 'bg-black' : 'bg-white'}   shadow-xl flex flex-col p-6`}>
                                {/* Header */}
                                <div className="flex items-center justify-between pb-4 border-b-1 border-base-300 ">
                                    <h2 className="text-xl font-bold">Menu</h2>
                                    <button onClick={() => setIsMenuOpen(false)} className="btn btn-ghost btn-circle">
                                        <X size={24} />
                                    </button>
                                </div>

                                                    <NavLink to={`/u/${user?.userName}/`} >
                                                        <div className='flex mt-5 gap-6  px-4 py-4  w-full justify-between rounded-lg  border-0 glass  border-gray-500 items-center'>
                                                            <div className="avatar">
                                                                <div className="w-15 rounded-full ring-0 ring-primary ring-offset-base-100 ring-offset-2">
                                                                    <img alt="User Avatar" src={`${(user?.profile?.profile_url) ? (user?.profile?.profile_url) : (`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`)}`} />
                                                                </div>
                                                            </div>
                                                            <div className="text-md self-center-safe ">
                                                                {user?.userName?.charAt(0).toUpperCase() + user?.userName?.slice(1).toLowerCase()}
                                                            </div>
                                                        </div>
                                                    </NavLink>
                           
                                    {/* Navigation */}
                                                    <nav className="flex-grow mt-6 space-y-4">
                                
                                                        {navLinks.map((link) => (
                                                            <NavLink
                                                                key={link.to}
                                                                to={link.to}
                                                                onClick={() => setIsMenuOpen(false)}
                                                                className={({ isActive }) => `flex items-center gap-4 p-2 rounded-lg text-lg ${baseLinkClass} ${isActive ? 'bg-primary/10 ' + activeLinkClass : ''}`}
                                                            >
                                                                {link.icon}
                                                                <span>{link.text}</span>
                                                            </NavLink>
                                                        ))}
                                                    </nav>


                                {/* Footer Actions */}
                                <div className="mt-6 pt-4 border-t border-base-300 space-y-4">
                                    <div className="flex items-center justify-between p-2 rounded-lg">
                                        <div className='flex items-center gap-4 text-lg'>
                                            <Palette size={20} /> Theme
                                        </div>
                                        <div className="flex items-center">
                                            <Sun size={20} />
                                            <input
                                                type="checkbox"
                                                className="toggle shadow border border-gray-200 text-primary toggle-primary mx-2"
                                                checked={theme === 'dark'}
                                                onChange={toggleTheme}
                                            />
                                            <Moon size={20} />
                                        </div>
                                    </div>


                                    <button onClick={handleLogout} className={`w-full flex items-center gap-4 p-2 rounded-lg text-lg ${baseLinkClass}`}>
                                        <LogOut size={20} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>




                    </div>

                </div>

            </div>
        </>
    )
}

export default AdminHeader;