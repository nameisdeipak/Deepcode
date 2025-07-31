
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';
import { Toaster, toast } from 'react-hot-toast'; 
import { Eye, EyeOff, Loader2, Code, Bot, Trophy } from 'lucide-react';

import HeaderLogSig from '../components/HeaderLogSig';

const signupSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  emailId: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .refine((val) => /[A-Z]/.test(val), { message: 'Must contain one uppercase letter' })
    .refine((val) => /[0-9]/.test(val), { message: 'Must contain one number' })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), { message: 'Must contain one special character' })
});

const SignupVisual = ({ themeClasses }) => (
    <div className={`flex flex-col justify-center p-10 rounded-2xl ${themeClasses.visualBg}  ${themeClasses.border}`}>
        <h1 className="text-4xl font-extrabold tracking-tight">
            Start Your Coding Journey
        </h1>
        <p className={`mt-4 text-lg ${themeClasses.textSecondary}`}>
            Join a community of developers leveling up their skills and preparing for top-tier companies.
        </p>
        <div className="mt-8 space-y-5">
            <div className="flex items-start gap-4">
                <div className={`mt-1 flex-shrink-0 p-2 rounded-full ${themeClasses.accent} bg-opacity-10 text-${themeClasses.accent}`}>
                    <Code size={20} className={themeClasses.accent} />
                </div>
                <div>
                    <h3 className="font-semibold">Vast Problem Library</h3>
                    <p className={themeClasses.textSecondary}>Practice with hundreds of problems.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                 <div className={`mt-1 flex-shrink-0 p-2 rounded-full ${themeClasses.accent} bg-opacity-10 text-${themeClasses.accent}`}>
                    <Bot size={20} className={themeClasses.accent}/>
                </div>
                <div>
                    <h3 className="font-semibold">AI-Powered Assistance</h3>
                    <p className={themeClasses.textSecondary}>Get hints and optimize your code.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                 <div className={`mt-1 flex-shrink-0 p-2 rounded-full ${themeClasses.accent} bg-opacity-10 text-${themeClasses.accent}`}>
                    <Trophy size={20} className={themeClasses.accent}/>
                </div>
                <div>
                    <h3 className="font-semibold">Compete and Grow</h3>
                    <p className={themeClasses.textSecondary}>Test your skills in live contests.</p>
                </div>
            </div>
        </div>
    </div>
);


function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, theme } = useSelector((state) => state.auth);

 
    const themeClasses = {
    bg: theme === 'dark' ? 'bg-black' : 'bg-gray-50',
    textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    accent: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
    hoverAccent: theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-700',
    border: theme === 'dark' ? 'border-gray-200/30' : 'border-gray-200',
    cardBg: theme === 'dark' ? 'bg-black' : 'bg-white',
    inputBg: theme === 'dark' ? 'bg-gray-100/4' : 'bg-white',
    visualBg: theme === 'dark' ? 'bg-black' : 'bg-white',
    buttonPrimary: theme === 'dark' ? 'bg-primary text-white' : 'bg-primary text-white',
    buttonHover: 'hover:opacity-90',
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Successfully registered!');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.textPrimary} font-sans`}>
      <Toaster />
      <HeaderLogSig />
      
      <main className="container mx-auto flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            

            <SignupVisual themeClasses={themeClasses} />


            <div className={`w-full p-8 space-y-6 rounded-2xl border ${themeClasses.border} ${themeClasses.cardBg} backdrop-blur-sm shadow-xl`}>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Create your free account
                    </h2>
                    <p className={`mt-2 text-sm ${themeClasses.textSecondary}`}>
                        Already a member?{' '}
                        <NavLink to="/login" className={`font-medium ${themeClasses.accent} ${themeClasses.hoverAccent} transition-colors`}>
                            Sign In
                        </NavLink>
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className={`block text-sm font-medium mb-1.5 ${themeClasses.textSecondary}`}>First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                className={`w-full px-4 py-2.5 rounded-md border ${themeClasses.inputBg} ${themeClasses.textPrimary} ${errors.firstName ? 'border-red-500' : themeClasses.border}`}
                                {...register('firstName')}
                            />
                            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="lastName" className={`block text-sm font-medium mb-1.5 ${themeClasses.textSecondary}`}>Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                className={`w-full px-4 py-2.5 rounded-md border ${themeClasses.inputBg} ${themeClasses.textPrimary} ${errors.lastName ? 'border-red-500' : themeClasses.border}`}
                                {...register('lastName')}
                            />
                            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
                        </div>
                    </div>

                  
                    <div>
                        <label htmlFor="emailId" className={`block text-sm font-medium mb-1.5 ${themeClasses.textSecondary}`}>Email</label>
                        <input
                            id="emailId"
                            type="email"
                            className={`w-full px-4 py-2.5 rounded-md border ${themeClasses.inputBg} ${themeClasses.textPrimary} ${errors.emailId ? 'border-red-500' : themeClasses.border}`}
                            {...register('emailId')}
                        />
                        {errors.emailId && <p className="mt-1 text-xs text-red-500">{errors.emailId.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className={`block text-sm font-medium mb-1.5 ${themeClasses.textSecondary}`}>Password</label>
                         <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className={`w-full px-4 py-2.5 pr-12 rounded-md border ${themeClasses.inputBg} ${themeClasses.textPrimary} ${errors.password ? 'border-red-500' : themeClasses.border}`}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute inset-y-0 right-0 flex items-center pr-4 ${themeClasses.textSecondary} ${themeClasses.hoverAccent}`}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                         </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>


                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center items-center gap-2 py-3 px-4 font-semibold rounded-lg transition-opacity disabled:opacity-60 disabled:cursor-not-allowed
                            ${themeClasses.buttonPrimary} ${themeClasses.buttonHover}`}
                        >
                            {loading && <Loader2 size={20} className="animate-spin" />}
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;