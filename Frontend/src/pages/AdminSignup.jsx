import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast, Toaster } from 'react-hot-toast';
import {
    User,
    Mail,
    Lock,
    LoaderCircle,
    Eye,
    EyeOff,
    KeySquare
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar'; 
import AdminHeader from '../components/AdminHeader';   
import axiosClient from '../utils/axiosClient';   

function AdminSignup() {
    const { theme } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        emailId: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const themeClasses = {
        bg: theme === 'dark' ? 'bg-black' : 'bg-white',
        cardBg: theme === 'dark' ? 'bg-gray-100/4' : 'bg-gray-50',
        textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
        border: theme === 'dark' ? 'border-gray-200/20' : 'border-gray-200',
        inputBg: theme === 'dark' ? 'bg-gray-100/5' : 'bg-white',
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!formData.userName.trim()) newErrors.userName = 'Username is required.';
        if (!formData.emailId) {
            newErrors.emailId = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
            newErrors.emailId = 'Email address is invalid.';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
        
            const response = await axiosClient.post('/user/admin/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                userName: formData.userName,
                emailId: formData.emailId,
                password: formData.password,
              
            });

            toast.success(response.data || "Admin created successfully!");

            
            setFormData({
                firstName: '', lastName: '', userName: '', emailId: '', password: '', confirmPassword: ''
            });
            setErrors({});

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data || "An unexpected error occurred.";
            toast.error(errorMessage);
            console.error("Admin creation error:", err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className={`${themeClasses.bg} min-h-screen font-sans`}>
                <AdminHeader openTab={`Admin Signup`} />
                <div className='flex'>
                    <AdminSidebar />
                    <main className={`flex-grow w-full max-w-5xl mx-auto min-h-screen p-4 md:p-8 ${themeClasses.textPrimary}`}>

                        {/* --- Page Header --- */}
                        <div className='w-full pb-8 text-center'>
                            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                                Admin Account Creation
                            </h1>
                            <p className={`text-md sm:text-lg ${themeClasses.textSecondary}`}>
                                Create and configure new administrator accounts.
                            </p>
                        </div>

                        {/* --- Form Container --- */}
                        <div className={`max-w-3xl mx-auto p-6 md:p-10 rounded-xl shadow-lg ${themeClasses.cardBg} ${themeClasses.border} border`}>
                            <form onSubmit={handleSubmit} noValidate className="space-y-6">

                                {/* --- Name Fields (First and Last) --- */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className={`label-text ${themeClasses.textPrimary}`}>First Name*</span>
                                        </label>
                                        <label className={`input input-bordered flex items-center gap-3 ${themeClasses.inputBg} ${errors.firstName ? 'input-error' : themeClasses.border}`}>
                                            <User size={16} className={themeClasses.textSecondary} />
                                            <input type="text" name="firstName" placeholder="e.g., Jane" value={formData.firstName} onChange={handleChange} className="grow bg-transparent" />
                                        </label>
                                        {errors.firstName && <p className="text-error text-sm mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label"><span className={`label-text ${themeClasses.textPrimary}`}>Last Name</span></label>
                                        <label className={`input input-bordered flex items-center gap-3 ${themeClasses.inputBg} ${themeClasses.border}`}>
                                            <User size={16} className={themeClasses.textSecondary} />
                                            <input type="text" name="lastName" placeholder="e.g., Doe" value={formData.lastName} onChange={handleChange} className="grow bg-transparent" />
                                        </label>
                                    </div>
                                </div>

                                {/* --- Username and Email --- */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control w-full">
                                    <label className="label"><span className={`label-text ${themeClasses.textPrimary}`}>Username*</span></label>
                                    <label className={`input input-bordered flex items-center gap-3 ${themeClasses.inputBg} ${errors.userName ? 'input-error' : themeClasses.border}`}>
                                        <KeySquare size={16} className={themeClasses.textSecondary} />
                                        <input type="text" name="userName" placeholder="e.g., janedoe" value={formData.userName} onChange={handleChange} className="grow bg-transparent" />
                                    </label>
                                    {errors.userName && <p className="text-error text-sm mt-1">{errors.userName}</p>}
                                </div>
                                 <div className="form-control w-full">
                                    <label className="label"><span className={`label-text ${themeClasses.textPrimary}`}>Email Address*</span></label>
                                    <label className={`input input-bordered flex items-center gap-3 ${themeClasses.inputBg} ${errors.emailId ? 'input-error' : themeClasses.border}`}>
                                        <Mail size={16} className={themeClasses.textSecondary} />
                                        <input type="email" name="emailId" placeholder="admin@example.com" value={formData.emailId} onChange={handleChange} className="grow bg-transparent" />
                                    </label>
                                    {errors.emailId && <p className="text-error text-sm mt-1">{errors.emailId}</p>}
                                </div>
                                </div>

                                {/* --- Password Fields --- */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control w-full">
                                        <label className="label"><span className={`label-text ${themeClasses.textPrimary}`}>Password*</span></label>
                                        <label className={`input input-bordered flex items-center gap-3 ${themeClasses.inputBg} ${errors.password ? 'input-error' : themeClasses.border}`}>
                                            <Lock size={16} className={themeClasses.textSecondary} />
                                            <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="grow bg-transparent" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </label>
                                        {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label"><span className={`label-text ${themeClasses.textPrimary}`}>Confirm Password*</span></label>
                                        <label className={`input input-bordered flex items-center gap-3 ${themeClasses.inputBg} ${errors.confirmPassword ? 'input-error' : themeClasses.border}`}>
                                            <Lock size={16} className={themeClasses.textSecondary} />
                                            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="grow bg-transparent" />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="focus:outline-none">
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </label>
                                        {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
                                    </div>
                                </div>
                                
                                {/* --- Submit Button --- */}
                                <div className="pt-4">
                                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <LoaderCircle size={20} className="animate-spin" />
                                                Creating Admin...
                                            </>
                                        ) : (
                                            "Create New Admin"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </main>
                </div>
            </div>
        </>
    );
}

export default AdminSignup;