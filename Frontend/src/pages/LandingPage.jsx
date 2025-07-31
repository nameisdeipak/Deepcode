import React from 'react';
import { NavLink } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { themeChanger } from '../authSlice';
import { Moon, Sun, Code, Bot, Trophy, PlayCircle, BarChart, Check, Zap } from 'lucide-react';
import Footer from '../components/Footer'
import '../styles/Header.css'; 
import HeaderLogSig from '../components/HeaderLogSig';


const LandingPageHeader = ({ theme, toggleTheme, themeClasses }) => {
    return (
        <header className={`sticky top-0 z-50 w-full backdrop-blur-sm border-b ${themeClasses.border}`}>
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <NavLink to="/" className="text-2xl font-bold text-glitch-hover" data-text="DeepCode">
                    DeepCode
                </NavLink>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-6">
                        <NavLink to="/login" className={`${themeClasses.textSecondary} hover:${themeClasses.textPrimary} transition-colors`}>
                            Login
                        </NavLink>
                        <NavLink to="/signup" className={`px-4 py-2 rounded-md font-semibold text-sm ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                            Sign Up
                        </NavLink>
                    </div>
                    <button onClick={toggleTheme} className={`p-2 rounded-full ${themeClasses.hoverBg}`}>
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </nav>
        </header>
    );
};


const LandingPage = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.auth);

    const toggleTheme = () => {
        dispatch(themeChanger());
    };

    const themeClasses = {
        bg: theme === 'dark' ? 'bg-black' : 'bg-white',
        textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
        accent: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        border: theme === 'dark' ? 'border-gray-200/30' : 'border-gray-200',
        cardBg: theme === 'dark' ? 'bg-gray-100/5' : 'bg-white',
        hoverBg: theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200',
        buttonPrimary: theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white',
    };

    const features = [
        {
            icon: <Code size={28} className={themeClasses.accent} />,
            title: "Vast Problem Library",
            description: "Access hundreds of curated problems from easy to hard, covering all essential data structures and algorithms."
        },
        {
            icon: <Bot size={28} className={themeClasses.accent} />,
            title: "AI-Powered Assistant",
            description: "Stuck on a problem? Get hints, explanations, and code optimizations from our integrated AI chat."
        },
        {
            icon: <Trophy size={28} className={themeClasses.accent} />,
            title: "Live Contests",
            description: "Compete with developers worldwide in real-time contests to test your skills under pressure."
        }
    ];

    return (
        <div className={`${themeClasses.bg} ${themeClasses.textPrimary}`}>
        <HeaderLogSig/>
            <main>

                <section className="text-center container mx-auto px-6 py-20 md:py-32">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        Welcome on  
                        <span className={`  ${themeClasses.accent}`} data-text="DeepCode"> Deepcode ,</span>
                           
                    </h1>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        Master Algorithms. <br />
                        <span className={themeClasses.accent}>Ace Interviews.</span> The Modern Way.
                    </h1>
                    <p className={`mt-6 max-w-2xl mx-auto text-lg md:text-xl ${themeClasses.textSecondary}`}>
                        DeepCode combines a vast problem library with an AI-powered assistant to help you level up your coding skills faster than ever before.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <NavLink to="/signup" className={`px-8 py-3 rounded-lg font-bold text-lg ${themeClasses.buttonPrimary} hover:opacity-90 transition-opacity`}>
                            Get Started for Free
                        </NavLink>
                    </div>
                </section>

             
                <section className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100'} py-20`}>
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">Why DeepCode?</h2>
                            <p className={`mt-4 max-w-xl mx-auto ${themeClasses.textSecondary}`}>Everything you need to become a confident, job-ready developer.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className={`p-8 rounded-xl border ${themeClasses.border} ${themeClasses.cardBg}`}>
                                    <div className="mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className={themeClasses.textSecondary}>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
       
                <section className="py-20">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-12">Get Started in 3 Easy Steps</h2>
                        <div className="relative flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto">
                           {/* Dotted line for desktop */}
                           <div className={`hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2 border-t-2 border-dashed ${themeClasses.border}`}></div>
                            
                            <div className="relative z-10 flex flex-col items-center mb-12 md:mb-0">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl border-2 ${themeClasses.border} ${themeClasses.cardBg}`}>1</div>
                                <h3 className="mt-4 text-lg font-semibold">Choose a Problem</h3>
                                <p className={`mt-1 max-w-xs ${themeClasses.textSecondary}`}>Pick from our extensive library.</p>
                            </div>
                            <div className="relative z-10 flex flex-col items-center mb-12 md:mb-0">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl border-2 ${themeClasses.border} ${themeClasses.cardBg}`}>2</div>
                                <h3 className="mt-4 text-lg font-semibold">Code Your Solution</h3>
                                <p className={`mt-1 max-w-xs ${themeClasses.textSecondary}`}>Use our feature-rich editor.</p>
                            </div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl border-2 ${themeClasses.border} ${themeClasses.cardBg}`}>3</div>
                                <h3 className="mt-4 text-lg font-semibold">Get Instant Feedback</h3>
                                <p className={`mt-1 max-w-xs ${themeClasses.textSecondary}`}>Submit and see results in seconds.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
            
                <section className="container mx-auto px-6 py-20">
                    <div className={`text-center rounded-2xl p-10 md:p-16 border ${themeClasses.border} ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gray-100'}`}>
                         <h2 className="text-3xl md:text-4xl font-bold">Ready to Elevate Your Skills?</h2>
                         <p className={`mt-4 max-w-xl mx-auto ${themeClasses.textSecondary}`}>
                            Join thousands of developers preparing for their dream jobs on DeepCode.
                         </p>
                         <div className="mt-8">
                             <NavLink to="/signup" className={` max-sm:px-2 px-10 py-4 rounded-lg font-bold text-lg ${themeClasses.buttonPrimary} hover:opacity-90 transition-opacity`}>
                                 Sign Up and Start Coding
                             </NavLink>
                         </div>
                    </div>
                </section>
            </main>


            <Footer/>

        </div>
    );
};

export default LandingPage;