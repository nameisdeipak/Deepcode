import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { themeChanger } from '../authSlice';
import { Moon, Menu, X, Sun, Home, Palette, LogIn } from 'lucide-react';
import '../styles/Header.css';


const navLinks = [
    { to: "/", text: "Home", icon: <Home size={20} /> },
    { to: "/login", text: "Login", icon: <LogIn size={20} /> },
    { to: "/signup", text: "Singup", icon: <LogIn size={20} /> },


];

const activeLinkClass = "text-primary font-semibold";
const baseLinkClass = "hover:text-primary transition-colors duration-200";

const HeaderLogSig = () => {
    const dispatch = useDispatch();
    const { theme, isAuthenticated } = useSelector((state) => state.auth);

    const { pathname } = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleTheme = () => {
        dispatch(themeChanger());
    };

    const themeClasses = {
        border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
        hoverBg: theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200',
    };

    const activeLinkStyle = `px-4 py-2 rounded-md font-semibold text-sm ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
        }`;


    const inactiveLinkStyle = `px-4 py-2 rounded-md font-semibold text-sm ${themeClasses.textSecondary} hover:${themeClasses.textPrimary} transition-colors`;


    return (
        <>
            <nav className={`sticky top-0 z-40 w-full border-b ${themeClasses.border} ${theme == 'dark' ? 'bg-gray-50/10 border-gray-50/10 ' : 'glass'} backdrop-blur-sm shadow-md`}>

                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <NavLink to="/" className="text-2xl font-bold text-glitch-hover" data-text="DeepCode">
                    DeepCode
                </NavLink>

                <div className="flex items-center gap-4">
                    {!isAuthenticated && (
                        <div className="hidden sm:flex items-center gap-4">

                            <NavLink
                                to="/"
                                className={pathname === '/' ? activeLinkStyle : inactiveLinkStyle}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/login"
                                className={pathname === '/login' ? activeLinkStyle : inactiveLinkStyle}
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/signup"
                                className={pathname === '/signup' ? activeLinkStyle : inactiveLinkStyle}
                            >
                                Sign Up
                            </NavLink>
                        </div>
                    )}

                    <button onClick={toggleTheme} className={` hidden sm:block p-2 rounded-full ${themeClasses.hoverBg}`}>
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <div className="sm:hidden">
                        <button onClick={() => setIsMenuOpen(true)} className="btn btn-ghost btn-circle">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
</div>


            </nav>
                <div
                    className={`fixed inset-0 z-50 block sm:hidden    transform transition-transform duration-300 ease-in-out ${isMenuOpen ? " translate-x-0" : "  translate-x-full"
                        }`}
                >
                    {/* Overlay */}
                    <div
                        className="absolute inset-0  min-h-screen bg-black/50"
                        onClick={() => setIsMenuOpen(false)}
                    ></div>

                    {/* Sidebar Content */}
                    <div className={` ${isMenuOpen ? 'block' : 'hidden'} relative ml-auto  max-h-screen overflow-y-auto w-4/5  max-sm:w-full ${theme == 'dark' ? 'bg-black' : 'bg-white'}   shadow-xl flex flex-col p-6`}>
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b-1 border-base-300 ">
                            <h2 className="text-xl font-bold">Menu</h2>
                            <button onClick={() => setIsMenuOpen(false)} className="btn btn-ghost btn-circle">
                                <X size={24} />
                            </button>
                        </div>


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


                        </div>
                    </div>
                </div>
        </>
    );
};

export default HeaderLogSig;