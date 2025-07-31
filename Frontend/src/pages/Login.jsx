


import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { loginUser, clearLoginSuccess } from "../authSlice"; 
import { toast, Toaster } from 'react-hot-toast';
import { Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';

import HeaderLogSig from '../components/HeaderLogSig'; 


const loginSchema = z.object({
  emailId: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});


const AuthVisual = ({ themeClasses }) => (
    <div className={`flex flex-col items-center justify-center p-8 rounded-2xl ${themeClasses.visualBg}  ${themeClasses.border}`}>
     
                  <div className="flex md:flex flex-col justify-center">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              Welcome Back to <span className={themeClasses.accent}>DeepCode</span>
            </h1>
            <p className={`mt-4 text-lg ${themeClasses.textSecondary}`}>
              Continue your journey to master algorithms and ace your next technical interview.
            </p>
            <ul className="mt-8 space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle size={22} className={themeClasses.accent} />
                  <span className={themeClasses.textSecondary}>{feature}</span>
                </li>
              ))}
            </ul>

          
          </div>
     

    </div>
);

  const features = [
    "Access hundreds of curated problems",
    "Get hints from an AI-powered assistant",
    "Compete in live coding contests"
  ];


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, theme } = useSelector((state) => state.auth);

  const themeClasses = {
    // Page & Text
    bg: theme === 'dark' ? 'bg-black' : 'bg-gray-50',
    textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    accent: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
    hoverAccent: theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-700',
    
    // Borders & Backgrounds
    border: theme === 'dark' ? 'border-gray-200/30' : 'border-gray-200',
    cardBg: theme === 'dark' ? 'bg-black' : 'bg-white',
    inputBg: theme === 'dark' ? 'bg-gray-100/4' : 'bg-white',
    
    // Specific element for the left column visual
    visualBg: theme === 'dark' ? 'bg-black' : 'bg-white',

    // Themed Button
    buttonPrimary: theme === 'dark' ? 'bg-primary text-white' : 'bg-primary text-white',
    buttonHover: 'hover:opacity-90',
  };


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const prevErrorRef = useRef();
  useEffect(() => {
    if (error && prevErrorRef.current !== error) {
      toast.error('Invalid credentials, please try again.', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: theme === 'dark' ? '#1f2937' : '#fef2f2',
          color: theme === 'dark' ? '#f87171' : '#b91c1c',
          border: `1px solid ${theme === 'dark' ? '#374151' : '#fca5a5'}`,
        },
      });
      prevErrorRef.current = error;
    }
  }, [error, theme]);

  const onSubmit = (data) => {
    dispatch(clearLoginSuccess());
    dispatch(loginUser(data));
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.textPrimary} font-sans`}>
      <Toaster />
      <HeaderLogSig />
      
      <main className="container mx-auto flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            

            <AuthVisual themeClasses={themeClasses} />

            <div className={`w-full p-8 space-y-6 rounded-2xl border ${themeClasses.border} ${themeClasses.cardBg} backdrop-blur-sm shadow-xl`}>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Sign in to your account
                    </h2>
                    <p className={`mt-2 text-sm ${themeClasses.textSecondary}`}>
                        Don't have an account?{' '}
                        <NavLink to="/signup" className={`font-medium ${themeClasses.accent} ${themeClasses.hoverAccent} transition-colors`}>
                            Sign Up
                        </NavLink>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                    <div>
                        <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${themeClasses.textSecondary}`}>Email</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="john.doe@example.com"
                            className={`w-full px-4 py-2.5 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50
                            ${themeClasses.inputBg} ${themeClasses.textPrimary} 
                            ${errors.emailId ? 'border-red-500 focus:ring-red-500' : `${themeClasses.border} focus:ring-blue-500 focus:border-blue-500`}`}
                            {...register('emailId')}
                        />
                        {errors.emailId && <p className="mt-2 text-sm text-red-500">{errors.emailId.message}</p>}
                    </div>


                    <div>
                         <label htmlFor="password" className={`block text-sm font-medium mb-1.5 ${themeClasses.textSecondary}`}>Password</label>
                         <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={`w-full px-4 py-2.5 pr-12 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50
                                ${themeClasses.inputBg} ${themeClasses.textPrimary} 
                                ${errors.password ? 'border-red-500 focus:ring-red-500' : `${themeClasses.border} focus:ring-blue-500 focus:border-blue-500`}`}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute inset-y-0 right-0 flex items-center pr-4 ${themeClasses.textSecondary} ${themeClasses.hoverAccent}`}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                         </div>
                        {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
                    </div>
                    

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center items-center gap-2 py-3 px-4 font-semibold rounded-lg transition-opacity disabled:opacity-60 disabled:cursor-not-allowed
                            ${themeClasses.buttonPrimary} ${themeClasses.buttonHover}`}
                        >
                            {loading && <Loader2 size={20} className="animate-spin" />}
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
}

export default Login;