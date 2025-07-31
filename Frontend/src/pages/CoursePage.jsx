

import React from 'react';
import { useSelector } from 'react-redux';
import Header from "../components/Header";
import Footer from "../components/Footer";
import CourseList from '../components/CourseList'; 

import { Award, BookOpen, TrendingUp } from 'lucide-react';

const CourseBanner = ({ themeClasses }) => (
    <div className={`py-20 md:py-28 px-4 sm:px-6 lg:px-8 ${themeClasses.sectionBg}`}>
        <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold ${themeClasses.textPrimary} leading-tight`}>
                Your Path to Code Mastery
            </h1>
            <p className={`mt-6 text-lg sm:text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`}>
                Our courses are meticulously crafted by industry experts to help you master in-demand skills, ace technical interviews, and accelerate your career in tech.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                        <Award className={`h-7 w-7 ${themeClasses.accent}`} />
                    </div>
                    <div>
                        <h3 className={`font-bold ${themeClasses.textPrimary}`}>Expert-Led Content</h3>
                        <p className={`text-sm ${themeClasses.textSecondary}`}>Learn from FAANG engineers and industry veterans.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                        <BookOpen className={`h-7 w-7 ${themeClasses.accent}`} />
                    </div>
                    <div>
                        <h3 className={`font-bold ${themeClasses.textPrimary}`}>Hands-on Learning</h3>
                        <p className={`text-sm ${themeClasses.textSecondary}`}>Solidify concepts with practical projects and exercises.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                        <TrendingUp className={`h-7 w-7 ${themeClasses.accent}`} />
                    </div>
                    <div>
                        <h3 className={`font-bold ${themeClasses.textPrimary}`}>Career-Focused Tracks</h3>
                        <p className={`text-sm ${themeClasses.textSecondary}`}>Guided paths designed to land you your dream job.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

function CoursesPage() {
    const { theme } = useSelector((state) => state.auth);

    const themeClasses = {
        bg: theme === 'dark' ? 'bg-black' : 'bg-white',
        sectionBg: theme === 'dark' ? 'bg-black' : 'bg-slate-50',
        textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
        accent: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
    };

    return (
        <div className={`${themeClasses.bg} ${themeClasses.textPrimary}`}>
            <Header />
            <main>
                <CourseBanner themeClasses={themeClasses} />
                <CourseList />
            </main>
            <Footer />
        </div>
    );
}

export default CoursesPage;