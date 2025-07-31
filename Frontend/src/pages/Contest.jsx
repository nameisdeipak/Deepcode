


import React from 'react';
import { useSelector } from 'react-redux';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Swords, ShieldCheck } from 'lucide-react';

const ContestHero = ({ themeClasses }) => (
    <div className={`py-20 md:py-24 text-center ${themeClasses.sectionBg}`}>
        <div className="container mx-auto px-4">
            <Swords className={`mx-auto h-16 w-16 mb-4 ${themeClasses.accent}`} strokeWidth={1.5} />
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold ${themeClasses.textPrimary}`}>
                The Contest Arena
            </h1>
            <p className={`mt-4 text-lg sm:text-xl ${themeClasses.textSecondary} max-w-2xl mx-auto`}>
                Test your problem-solving skills against a global community. Compete, learn, and climb the leaderboards.
            </p>
        </div>
    </div>
);

const ComingSoonPlaceholder = ({ themeClasses }) => (
    <div className="container mx-auto px-4 py-20 sm:py-24">
        <div className={`
            max-w-3xl mx-auto text-center border rounded-2xl p-8 sm:p-12 
            relative overflow-hidden
            ${themeClasses.border}
            ${themeClasses.bg === 'bg-black' ? 'bg-black' : 'bg-white'}
        `}>
            <div className="absolute inset-0 bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

            <div className="relative">
                <ShieldCheck className={`mx-auto h-12 w-12 mb-5 text-green-500`} strokeWidth={1.5} />
                <h2 className={`text-3xl font-bold ${themeClasses.textPrimary}`}>
                    Contests Are Coming Soon!
                </h2>
                <p className={`mt-4 text-lg ${themeClasses.textSecondary}`}>
                    We are working hard to bring you exciting weekly and bi-weekly coding contests. Get ready to showcase your skills, win prizes, and get noticed. Stay tuned!
                </p>
                <button
                    disabled
                    className="mt-8 px-8 py-3 font-bold rounded-lg bg-gray-500 text-white/70 cursor-not-allowed">
                    Launching Soon...
                </button>
            </div>
        </div>
    </div>
);


function Contest() {
    const { theme } = useSelector((state) => state.auth);

    const themeClasses = {
        bg: theme === 'dark' ? 'bg-black' : 'bg-white',
        sectionBg: theme === 'dark' ? 'bg-black' : 'bg-slate-50',
        textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
        accent: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        border: theme === 'dark' ? 'border-gray-800' : 'border-gray-200',
    };

    return (
        <div className={`${themeClasses.bg} ${themeClasses.textPrimary}`}>
            <Header />
            <main>
                <ContestHero themeClasses={themeClasses} />
                <ComingSoonPlaceholder themeClasses={themeClasses} />
            </main>
            <Footer />
        </div>
    );
}

export default Contest;