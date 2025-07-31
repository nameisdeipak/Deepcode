import { NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

import { logoutUser, clearLoginSuccess, themeChanger } from '../authSlice';
import {
    Moon,BookAIcon, Sun, X, Menu, Compass, ListChecks, Trophy, MessageCircle,
    Tv, Store, LogOut, ShieldUser, Palette, Settings, Check
} from 'lucide-react';
import '../styles/Header.css';


const navLinks = [
    { to: "/", text: "Explore", icon: <Compass size={20} /> },
    { to: "/problemset", text: "Problems", icon: <ListChecks size={20} /> },
    { to: "/course", text: "Course", icon: <BookAIcon size={20} /> },
    { to: "/contest", text: "Contest", icon: <Trophy size={20} /> },
    { to: "/discuss", text: "Discuss", icon: <MessageCircle size={20} /> },
  
];

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, theme } = useSelector((state) => state.auth);


    const [isMenuOpen, setIsMenuOpen] = useState(false);


    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.body.className = `${theme === 'dark' ? 'bg-black' : 'white'}`
    }, [theme]);


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

    const toggleTheme = () => {
        dispatch(themeChanger())
    };


    const activeLinkClass = "text-primary font-semibold";
    const baseLinkClass = "hover:text-primary transition-colors duration-200";

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <nav className={`sticky top-0 z-40 w-full border-b ${theme == 'dark' ? 'bg-gray-50/10 border-gray-50/10 ' : 'glass'} backdrop-blur-sm shadow-md`}>
                <div className="container mx-auto px-4">
                    <div className={`flex items-center justify-around  max-md:justify-between h-16`}>
                        <NavLink to="/" className="text-2xl font-bold text-glitch-hover" data-text="DeepCode">
                            DeepCode
                            
                        </NavLink>


                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
                                >
                                    {link.text}
                                </NavLink>
                            ))}
                        </div>

                       
                        <div className="hidden md:flex items-center space-x-4">



                            <div className="dropdown dropdown-end ">
                                <div tabIndex={0} role="button" className={`  cursor-pointer  flex  justify-start items-end  gap-2  rounded-full avatar ${theme == 'dark' ? 'bg-gray-50/10 border-gray-50/10 ' : 'glass'} p-1`}>
                                    <div className="w-10 rounded-full  ">
                                        <img alt="User Avatar" src={`${(user?.profile?.profile_url) ? (user?.profile?.profile_url) : (`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`)}`} />
                                    
                                            
                                
                                    </div>
                              
                                </div>
                                <ul tabIndex={0} className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100  rounded-box min-h-50 w-65   ${theme == 'dark' ? 'border border-gray-200/20 bg-black' : ''}`}>

                                    {/* Profile */}
                                    <NavLink to={`/u/${user?.userName}/`} >
                                        <div className='flex mt-1 gap-4  px-2 py-2  w-full  rounded-lg  border-0  glass  border-gray-500 items-center'>
                                            <div className="avatar">
                                                <div className="w-13 rounded-full ">
                                                    <img alt="User Avatar" src={`${(user?.profile?.profile_url) ? (user?.profile?.profile_url) : (`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`)}`} />
                                                </div>
                                            </div>
                                            <div className="text-sm self-center-safe  ">
                                                {user?.userName?.charAt(0).toUpperCase() + user?.userName?.slice(1).toLowerCase()}
                                            </div>
                                        </div>
                                    </NavLink>

                                    <div className="mt-4 pt-2 border-t border-gray-300 space-x-2">


                                        {user.role === 'admin' && (
                                            <NavLink to="/admin-panel" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-4 p-2 rounded-lg text-sm ${baseLinkClass}`}>
                                                <ShieldUser size={20} /> Admin Pannel
                                            </NavLink>
                                        )}

                                        {/* Settings button  */}
                                        <NavLink to="/profile" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-4 p-2 rounded-lg text-sm ${baseLinkClass}`}>
                                            <Settings size={20} /> Setting
                                        </NavLink>

                                        {/* Theme dropdown */}
                                        <div className=' dropdown dropdown-left '>
                                            <div tabIndex={0} role='button' className="flex items-center justify-between p-2 rounded-lg">
                                                <div className={`flex items-center gap-4 text-sm  ${baseLinkClass}`}>
                                                    <Palette size={20} /> Appearence
                                                </div>
                                            </div>
                                            <ul tabIndex={0} className={` menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow ${theme == 'dark' ? 'bg-black' : 'bg-base-100'} rounded-box h-auto gap-1  w-50`}>
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
                                        <button onClick={handleLogout} className={`w-full flex items-center gap-4 p-2 rounded-lg text-sm  ${baseLinkClass}`}>
                                            <LogOut size={20} /> Sign Out
                                        </button>
                                    </div>
                                </ul>
                            </div>

                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(true)} className="btn btn-ghost btn-circle">
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

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
                <div className={`relative ml-auto h-full overflow-y-auto w-4/5 max-sm:w-full ${theme == 'dark' ? 'bg-black' : 'bg-white'}   shadow-xl flex flex-col p-6`}>
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
                                    className="toggle toggle-primary mx-2"
                                    checked={theme === 'dark'}
                                    onChange={toggleTheme}
                                />
                                <Moon size={20} />
                            </div>
                        </div>

                        {user.role === 'admin' && (
                            <NavLink to="/admin-panel" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-4 p-2 rounded-lg text-lg ${baseLinkClass}`}>
                                <ShieldUser size={20} /> Admin Panel
                            </NavLink>
                        )}
                        <NavLink to="/profile" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-4 p-2 rounded-lg text-lg ${baseLinkClass}`}>
                            <Settings size={20} /> Setting
                        </NavLink>
                        <button onClick={handleLogout} className={`w-full flex items-center gap-4 p-2 rounded-lg text-lg ${baseLinkClass}`}>
                            <LogOut size={20} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;



