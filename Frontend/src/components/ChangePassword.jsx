




import { useState } from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Lock, KeyRound, ShieldCheck, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { toast, Toaster } from 'react-hot-toast';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";


const changepasswordSchema = z.object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .refine(val => /[A-Z]/.test(val), { message: 'Must contain an uppercase letter' })
        .refine(val => /[0-9]/.test(val), { message: 'Must contain a number' })
        .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), { message: 'Must contain a special character' }),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
}).superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
        ctx.addIssue({ code: "custom", message: "Passwords do not match", path: ["confirmPassword"] });
    }
});





function ChangePassword() {
    const { theme } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const themeClasses = {
        bg: theme === 'dark' ? 'bg-black' : 'bg-gray-50',
        cardBg: theme === 'dark' ? 'bg-black' : 'bg-white',
        textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
        inputBg: theme === 'dark' ? 'bg-gray-100/4' : 'bg-white',
        border: theme === 'dark' ? 'border-gray-200/20' : 'border-gray-200',
        accent: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
    };

    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(changepasswordSchema),
        mode: "onTouched"
    });


    const newPasswordValue = useWatch({ control, name: "newPassword", defaultValue: "" });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await axiosClient.patch('/user/profile/changepassword', data);
            toast.success("Password updated successfully!");
            reset();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to update password.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Toaster position="top-center" reverseOrder={false} />

            <div className={`min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans ${themeClasses.bg}`}>
                <div className="w-full max-w-sm space-y-8">

                    <div>

                        <h1 className={`text-3xl sm:text-4xl font-bold text-center ${themeClasses.textPrimary}`}>
                            Change Your Password
                        </h1>
                        <p className={`mt-2 text-center text-md ${themeClasses.textSecondary}`}>
                            Update your password for enhanced security.
                        </p>

                        <button
                            onClick={() => navigate(-1)}
                            className={`flex mt-4 btn btn-sm mx-auto items-center gap-2 text-sm mb-6 transition-colors ${themeClasses.textSecondary} hover:${themeClasses.accent}`}
                        >
                            <ArrowLeft size={16} />
                            Back to Profile
                        </button>
                    </div>

                    {/* Form Card */}
                    <div className={`p-6 sm:p-10 rounded-2xl shadow-xl border ${themeClasses.cardBg} ${themeClasses.border}`}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Current Password */}
                            <div className="form-control">
                                <label className={`label ${themeClasses.textSecondary}`}><span className="label-text">Current Password</span></label>
                                <label className={`input input-bordered flex items-center gap-3 ${themeClasses.inputBg} ${themeClasses.border} ${errors.oldPassword ? 'input-error' : ''}`}>
                                    <KeyRound size={16} className={themeClasses.textSecondary} />
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        placeholder="Enter your current password"
                                        className="grow bg-transparent"
                                        {...register('oldPassword')}
                                    />
                                    <button type="button" onClick={() => setShowOldPassword(!showOldPassword)}>
                                        {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </label>
                                {errors.oldPassword && <p className="text-error text-sm mt-1">{errors.oldPassword.message}</p>}
                            </div>

                            {/* New Password */}
                            <div className="form-control">
                                <label className={`label ${themeClasses.textSecondary}`}><span className="label-text">New Password</span></label>
                                <label className={`input input-bordered flex items-center gap-3 ${themeClasses.inputBg} ${themeClasses.border} ${errors.newPassword ? 'input-error' : ''}`}>
                                    <Lock size={16} className={themeClasses.textSecondary} />
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter your new password"
                                        className="grow bg-transparent"
                                        {...register('newPassword')}
                                    />
                                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </label>
                                {errors.newPassword && <p className="text-error text-sm mt-1">{errors.newPassword.message}</p>}

                           
                            </div>

                            {/* Confirm Password */}
                            <div className="form-control">
                                <label className={`label ${themeClasses.textSecondary}`}><span className="label-text">Confirm New Password</span></label>
                                <label className={`input input-bordered flex items-center gap-3 ${themeClasses.inputBg} ${themeClasses.border} ${errors.confirmPassword ? 'input-error' : ''}`}>
                                    <ShieldCheck size={16} className={themeClasses.textSecondary} />
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Confirm your new password"
                                        className="grow bg-transparent"
                                        {...register('confirmPassword')}
                                    />
                                </label>
                                {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="form-control pt-4">
                                <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <LoaderCircle size={20} className="animate-spin" />
                                            Updating...
                                        </>
                                    ) : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default ChangePassword;