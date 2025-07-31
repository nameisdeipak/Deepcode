import React from 'react';
import { useSelector } from 'react-redux';
import { Terminal } from 'lucide-react';


const DeepcodeLoader = () => {
  const { theme } = useSelector(state => state.auth);

  const themeClasses = {
    bg: theme === 'dark' ? 'bg-black' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    accent: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
  };

  const FloatingSymbol = ({ symbol, position, delay }) => (
    <div
      className={`absolute text-2xl md:text-3xl font-mono ${themeClasses.textSecondary} animate-float opacity-30 ${position}`}
      style={{ animationDelay: delay }}
    >
      {symbol}
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-300 ${themeClasses.bg}`}
    >
      <div className="relative flex flex-col items-center justify-center">

        <FloatingSymbol symbol="{ }" position="top-0 left-[-80px] md:left-[-120px]" delay="0s" />
        <FloatingSymbol symbol="/>" position="top-10 right-[-80px] md:right-[-120px]" delay="0.5s" />
        <FloatingSymbol symbol=";" position="bottom-0 left-[-60px] md:left-[-100px]" delay="1s" />
        <FloatingSymbol symbol="()" position="bottom-10 right-[-70px] md:right-[-110px]" delay="1.5s" />


        <div className="flex items-center gap-3">
            <Terminal className={themeClasses.accent} size={40} />
             <h1 className={`text-5xl md:text-6xl font-bold tracking-tighter ${themeClasses.textPrimary}`}>
              Deepcode
            </h1>
        </div>


        <div className="flex items-center justify-center mt-6 space-x-1.5">
          <p className={`text-sm ${themeClasses.textSecondary}`}>
            Initializing environment
          </p>
          <div className="flex space-x-1">
             <span className={`h-2 w-2 rounded-full ${themeClasses.accent} animate-bounce-dot`}></span>
             <span className={`h-2 w-2 rounded-full ${themeClasses.accent} animate-bounce-dot`} style={{animationDelay: '0.2s'}}></span>
             <span className={`h-2 w-2 rounded-full ${themeClasses.accent} animate-bounce-dot`} style={{animationDelay: '0.4s'}}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepcodeLoader;