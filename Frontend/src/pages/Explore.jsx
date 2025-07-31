
import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { toast, Toaster } from 'react-hot-toast';
import { clearLoginSuccess } from '../authSlice';
import { ArrowRight,Code2,Youtube,Library, Star, Target, Users, Sparkles, Trophy } from 'lucide-react';

import Header from "../components/Header";
import CourseList from "../components/CourseList";
import Footer from "../components/Footer";

const WavyUnderline = ({ themeClasses }) => (
  <svg
    className={`absolute left-0 top-full w-full h-auto ${themeClasses.accent}`}
    viewBox="0 0 156 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M1 11.127C34.6667 2.12695 100.8 -4.87305 155 11.127"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);


const HeroSection = ({ themeClasses, theme }) => (
  <div className={`py-20 md:py-24 px-4 sm:px-6 lg:px-8 ${themeClasses.bg}`}>
    <div className="max-w-5xl mx-auto text-center">

      <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold ${themeClasses.textPrimary} leading-tight`}>
        Boost Your Coding Knowledge
        <br />
        <span className="relative inline-block">
          Redefine
          <WavyUnderline themeClasses={themeClasses} />
        </span>
        {' '}Success with{' '}
        <span className={themeClasses.accent}>
          DeepCode
        </span>
      </h1>

      <p className={`mt-8 text-lg sm:text-xl ${themeClasses.textSecondary} max-w-2xl mx-auto`}>
        Start your coding journey with DeepCode, daily practice your coding problem on here and improve Coding skills
      </p>

      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <NavLink
          to="/problemset"
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 font-bold rounded-lg transition-transform hover:scale-105
                bg-primary text-white`}
        >
          Start Solving <ArrowRight size={20} />
        </NavLink>

      </div>
    </div>
  </div>
);

const FeaturesSection = ({ themeClasses, theme }) => (
  <div className={`py-20 sm:py-24 ${themeClasses.sectionBg}`}>
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Succeed</h2>
        <p className={`mt-4 text-lg ${themeClasses.textSecondary}`}>
          We provide the tools, you bring the talent. Level up with features designed for champions.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className={`p-6 rounded-2xl border ${themeClasses.border} ${themeClasses.cardBg} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500/10 mb-5"><Code2 className="h-6 w-6 text-blue-400" /></div>
          <h3 className="text-xl font-bold mb-2">Blazing Fast Editor</h3>
          <p className={`${themeClasses.textSecondary} mb-4`}>A distraction-free, boilerplate-ready environment to focus purely on your logic.</p>
          <div className={`p-4 rounded-lg font-mono text-xs ${theme === 'dark' ? 'bg-black/50' : 'bg-gray-100'}`}><span className="text-purple-400">function</span> <span className="text-blue-400">solve</span>(<span className="text-orange-400">arr</span>) {'{'}<br />  <span className="text-purple-400">let</span> map = <span className="text-blue-400">new</span> Map();<br />  ...<br />{'}'}</div>
        </div>
        <div className={`p-6 rounded-2xl border ${themeClasses.border} ${themeClasses.cardBg} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-500/10 mb-5"><Youtube className="h-6 w-6 text-red-400" /></div>
          <h3 className="text-xl font-bold mb-2">Expert Video Editorials</h3>
          <p className={`${themeClasses.textSecondary}`}>Never get stuck. Watch detailed, step-by-step video solutions for challenging problems.</p>
          <div className={`mt-4 aspect-video rounded-lg ${theme === 'dark' ? 'bg-black/50' : 'bg-gray-100'} flex items-center justify-center`}><div className={`h-12 w-12 rounded-full border-2 ${themeClasses.border} flex items-center justify-center`}><ArrowRight size={24} className="-rotate-45" /></div></div>
        </div>
        <div className={`p-6 rounded-2xl border ${themeClasses.border} ${themeClasses.cardBg} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500/10 mb-5"><Library className="h-6 w-6 text-green-400" /></div>
          <h3 className="text-xl font-bold mb-2">Curated Learning Tracks</h3>
          <p className={`${themeClasses.textSecondary}`}>Guided paths to master specific domains, from core DSA to advanced System Design.</p>
          <div className="mt-4 flex flex-wrap gap-2">{['Data Structures', 'Algorithms', 'System Design (HLD)', 'LLD', 'Web Dev'].map(track => (<span key={track} className={`px-3 py-1 text-sm font-medium rounded-full ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200/80'}`}>{track}</span>))}</div>
        </div>
      </div>
    </div>
  </div>
);


const WhyChooseUsSection = ({ themeClasses }) => {
    const reasons = [
        { icon: Target, title: "Curated for Interviews", description: "Problems are hand-picked from real interviews at top tech companies to ensure you practice what matters." },
        { icon: Users, title: "Thriving Community", description: "Engage in discussions on every problem, learn from others, and climb the leaderboards in our weekly contests." },
        { icon: Sparkles, title: "Beyond the Algorithm", description: "Master concepts with detailed video editorials and dedicated tracks for System Design (HLD & LLD)." },
        { icon: Trophy, title: "Real-Time Contests", description: "Benchmark your skills against a global community in a real-time, competitive environment." }
    ];

    return (
        <div className={`py-20 sm:py-24 ${themeClasses.bg}`}>
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why DeepCode?</h2>
                    <p className={`mt-4 text-lg ${themeClasses.textSecondary}`}>We're more than just a problem bank. We're your dedicated partner for career growth.</p>
                </div>
                <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reasons.map(reason => (
                        <div key={reason.title} className="flex px-8  items-start gap-5">
                            <div className={`flex-shrink-0 mt-1 h-12 w-12 rounded-lg flex items-center justify-center ${themeClasses.sectionBg} border ${themeClasses.border}`}>
                                <reason.icon className={`h-6 w-6 ${themeClasses.accent}`} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{reason.title}</h3>
                                <p className={`mt-1 ${themeClasses.textSecondary}`}>{reason.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};




function Explore() {
  const dispatch = useDispatch();
  const { loginSuccess, theme } = useSelector((state) => state.auth);

  const prevLoginSuccessRef = useRef();
  useEffect(() => {
    if (loginSuccess && prevLoginSuccessRef.current !== loginSuccess) {
      toast.success('Login successful', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: theme === 'dark' ? '#059669' : '#dcfce7',
          color: theme === 'dark' ? '#f0fdf4' : '#14532d',
          border: `1px solid ${theme === 'dark' ? '#34d399' : '#6ee7b7'}`,
        },
      });
      prevLoginSuccessRef.current = loginSuccess;
      dispatch(clearLoginSuccess());
    }
  }, [loginSuccess, dispatch, theme]);

  const themeClasses = {
    bg: theme === 'dark' ? 'bg-black' : 'bg-white',
    sectionBg: theme === 'dark' ? 'bg-gray-200/4' : 'bg-slate-50',
    cardBg: theme === 'dark' ? 'bg-gray-100/0' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    accent: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
    border: theme === 'dark' ? 'border-gray-100/20' : 'border-gray-200',
  };

  return (
    <div className={themeClasses.bg}>
      <Toaster />
      <Header />

      <main>
        <HeroSection themeClasses={themeClasses} theme={theme} />

        <div id="courses">
          <CourseList />
        </div>

        <FeaturesSection themeClasses={themeClasses} theme={theme} />


        <WhyChooseUsSection themeClasses={themeClasses} theme={theme} />

      </main>

      <Footer />
    </div>
  );
}

export default Explore;


