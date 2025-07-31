import { useEffect, useState } from "react";
import { Image, TriangleAlert, ArrowUpRightSquare, X, Github, Check, User, Linkedin, Twitter, ChevronsLeftRightEllipsis } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NavLink, useNavigate } from "react-router";
import { toast, Toaster } from 'react-hot-toast';
import { logoutUser, clearLoginSuccess, updateUser, deleteUser } from "../authSlice";
import { z } from "zod"; import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "../utils/axiosClient";
import ProfileImage from '../components/Profileimg';


const profileSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
    lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
    userName: z.string().min(2, " user nam must be at least 3 characters").optional(),
    gender: z.string().optional(),
    summary: z.string().max(500, "Summary too long").optional(),
    website: z.string().url("Invalid URL").or(z.literal("")).optional(),
    github: z.string().url("Invalid URL").or(z.literal("")).optional(),
    linkedin: z.string().url("Invalid URL").or(z.literal("")).optional(),
    x_twitter: z.string().url("Invalid URL").or(z.literal("")).optional(),
});

function Profile() {

    const { user, theme } = useSelector((state) => state.auth)
    const [openTab, setOpenTab] = useState("basic");
    const [editingField, setEditingField] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editiProfile, setEditProfile] = useState(false);



    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearLoginSuccess());
        dispatch(logoutUser());

        toast.success(' Logout successful!', {
            duration: 1500,
            style: {
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #34d399',
            },
            iconTheme: {
                primary: '#10b981',
                secondary: '#ecfdf5',
            },
        });

        navigate('/login');
    };



    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(profileSchema)
    });


    // # : upload user Profile





    const handleEdit = (fieldName, currentValue) => {
        setEditingField(fieldName);
        setValue(fieldName, currentValue || "");
    };

    const cancelEdit = () => {
        setEditingField(null);
        reset();
    };



    const onSubmitField = async (data) => {
        console.log("Submitting data:", data);
        console.log("Editing field:", editingField);
        setIsSubmitting(true);
        try {
            // Prepare the data to send to the backend
            const updateData = { [editingField]: data[editingField] };

            // Special handling for social URLs
            if (['website', 'github', 'linkedin', 'x_twitter'].includes(editingField)) {
                updateData.social_Url = {
                    ...user.social_Url,
                    [editingField]: data[editingField]
                };
            }

            const response = await axiosClient.put(`/user/updateProfile`, updateData);
            console.log(response);
            dispatch(updateUser(response?.data?.user));
            toast.success(`${editingField} updated successfully!`);
            setEditingField(null);
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to update ${editingField}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderField = (label, fieldName, isSocialUrl = false) => {
        const currentValue = isSocialUrl
            ? user?.social_Url?.[fieldName] || 'Not Provided'
            : user?.[fieldName] || 'Not Provided';

        if (editingField === fieldName) {
            return (
                <form
                    onSubmit={handleSubmit(onSubmitField)}
                    className="flex items-center gap-2 w-full"
                >
                    {fieldName === 'gender' ? (
                        <select
                            {...register(fieldName)}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                    ) : fieldName === 'summary' ? (
                        <textarea
                            {...register(fieldName)}
                            className={`textarea textarea-bordered w-full ${errors[fieldName] ? 'textarea-error' : ''}`}
                            rows={3}
                            placeholder={`Enter ${label}`}
                        />
                    ) : (
                        <input
                            {...register(fieldName)}
                            className={`input input-bordered w-full ${errors[fieldName] ? 'input-error' : ''}`}
                            placeholder={`Enter ${label}`}
                        />
                    )}

                    {errors[fieldName] && (
                        <span className="text-error text-xs">{errors[fieldName].message}</span>
                    )}

                    <div className="flex gap-1">
                        <button
                            type="submit"
                            className="btn btn-xs btn-primary"
                            disabled={isSubmitting}
                        >
                            <Check size={16} />
                        </button>
                        <button
                            type='submit'
                            className="btn btn-xs btn-ghost"
                            onClick={cancelEdit}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </form>
            );
        }

        return (
            <div className="flex justify-between items-center w-full">
                <span className="text-gray-600 text-left truncate">
                    {currentValue === 'Not Provided' ? currentValue : currentValue}
                </span>
                <button
                    type="submit"
                    className="btn btn-primary btn-xs btn-soft"
                    onClick={() => handleEdit(fieldName, currentValue === 'Not Provided' ? '' : currentValue)}
                >
                    Edit
                </button>
            </div>
        );
    };

    const { social_Url, _id, role, profile, coursesPurchase, ...info } = { ...user }


    const [selectedUser, setSelectedUser] = useState(null);


    const openDeleteModal = () => {
        setSelectedUser(user);
        document.getElementById('delete_user_modal').showModal();
    };



    const confirmDelete = async () => {
        if (!selectedUser) return;

        try {

            const response = await axiosClient.delete('/user/deleteProfile');
            dispatch(deleteUser(response?.data?.user));
            toast.success("Profile Delete successful " + selectedUser?.userName);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred during deletion.";
            toast.error(errorMessage);
            console.error("Deletion error:", err);
        } finally {
            document.getElementById('delete_user_modal').close();
            setSelectedUser(null);
        }
    };

    
      const themeClasses = {
        bg: theme === 'dark' ? 'bg-black' : 'bg-white',
        sectionBg: theme === 'dark' ? 'bg-black' : 'bg-slate-50',
        textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
        accent: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        border: theme === 'dark' ? 'border-gray-200/20' : 'border-white',
    }

    return (
        <>

            <Header />

            {
                (editiProfile) && (
                    <ProfileImage editiProfile={editiProfile} setEditProfile={setEditProfile} />
                )
            }
            <div className="w-full    p-4 flex  flex-col  items-center justify-center  ">
                <div className="w-full max-w-6xl mt-5   flex items-end justify-between border-b-3 border-gray-400 pb-4 px-2 ">
                    <span className=" flex text-xl items-center justify-center gap-3 font-semibold ">DeepCode <User size={20} /> </span>
                    <button onClick={handleLogout} className={`btn btn-primary btn-soft`}>
                        Sign Out
                    </button>
                </div>

                {/* profile inforamtion  */}
                <div className="w-full min-h-screen max-w-6xl mt-5 flex flex-col md:flex-row max-lg:justify-center   justify-between bg-emerald-500/0 gap-5 lg:gap-0 flex-wrap ">
                    {/* profile div  */}
                    <div className={` relative w-6/24 max-lg:w-3xl max-md:w-full h-full   p-4  rounded-xl flex flex-col justify-start gap-4  ${themeClasses.bg } border ${ themeClasses.border} `}>


                        <div className=" flex gap-3 items-start rounded ">
                            <div className= " avatar  rounded-full ring-1 ring-black w-24  ">
                                <div className=" rounded-full ring-1 ring-black w-24">
                                <img src={`${(user?.profile?.profile_url) ? (user?.profile?.profile_url) : (`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`)}`} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 mt-4 self-end-safe ">
                            <button className="btn btn-xs btn-outline btn-primary absolute right-4 top-5 " onClick={() => setEditProfile(true)}>Edit Profile</button>
                            <span className="text-xs truncate"><span className={themeClasses.textSecondary}>FirstName: </span> {user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1).toLowerCase()}</span>
                            <span className="text-xs truncate"><span className={themeClasses.textSecondary}>LastName:  </span> {user?.lastName?.charAt(0).toUpperCase() + user?.lastName?.slice(1).toLowerCase()}</span>
                            </div>
                        </div>

                        <div className="mt-4 px-1 text-sm font-medium">Deepcode ID : {user?.userName?.charAt(0).toUpperCase() + user?.userName?.slice(1).toLowerCase()}</div>
                        <div className="flex flex-col space-y-4 max-md:hidden">
                            <button className={`btn  ${openTab == 'basic' ? ('') : ('btn-soft')} btn-primary `} onClick={() => setOpenTab('basic')}>Basic information</button>
                            <button className={`btn  ${openTab == 'account' ? ('') : ('btn-soft')} btn-primary`} onClick={() => setOpenTab('account')}>Account</button>
                        </div>
                    </div>

                    {/* information section  */}
                    <div className="w-full h-full max-w-3xl bg-transparent  shadow border border-gray-100/15 rounded-xl p-2 ">

                        {/* tab that show in only mobiles */}
                        <div className="tabs tabs-box bg-gray-400/10 rounded hidden max-md:block ">
                            <input type="radio" name="my_tabs_1" className="tab" aria-label="Basic information" onClick={() => setOpenTab('basic')} />
                            <input type="radio" name="my_tabs_1" className="tab" aria-label="Account " onClick={() => setOpenTab('account')} defaultChecked />
                        </div>


                        {/* basic information  */}
                        {openTab === 'basic' && (
                            <div className="flex flex-col mt-4 bg-gray-100/0   py-2 rounded-xl px-1   ">
                                <h4 className={`text-left font-medium px-2 text-sm   max-md:hidden  py-2 rounded
                                
                                                 ${theme == 'dark' ? 'bg-gray-200/30 text-white ' : 'text-primary bg-gray-200 '}`}
                                >
                                    Basic Information</h4>
                                {/* name of user */}
                                <div className="grid grid-cols-2 max-sm:grid-cols-1 w-full px-2  justify-between text-left  py-4 border-b-1 border-gray-300 ">
                                    <span>First Name</span>
                                    <div className="flex justify-between items-center ">
                                        {renderField("First Name", "firstName")}
                                    </div>
                                </div>
                                {/* last name of user  */}
                                <div className="grid grid-cols-2 max-sm:grid-cols-1 w-full px-2  justify-between text-left  py-4 border-b-1 border-gray-300 ">
                                    <span>Last Name</span>
                                    <div className="flex justify-between items-center ">
                                        {renderField("Last Name", "lastName")}
                                    </div>
                                </div>

                                {/* gender of user  */}
                                <div className="grid grid-cols-2 max-sm:grid-cols-1 w-full px-2  justify-between text-left  py-4 border-b-1 border-gray-300 ">
                                    <span>Gender</span>
                                    <div className="flex justify-between items-center ">
                                        {renderField("Gender", "gender")}
                                    </div>
                                </div>

                                {/* summary of user  */}
                                <div className="grid grid-cols-2 max-sm:grid-cols-1 w-full px-2  justify-between text-left  py-4 border-b-1 border-gray-300 ">
                                    <span>Summary</span>
                                    <div className="flex justify-between items-center ">
                                        {renderField("Summary", "summary")}
                                    </div>
                                </div>

                                {/* website / protfolio  link of user  */}
                                <div className="grid grid-cols-2 max-sm:grid-cols-1 w-full px-2  justify-between text-left  py-4 border-b-1 border-gray-300 ">
                                    <span className="flex items-center  gap-1"><ChevronsLeftRightEllipsis size={18} />Website</span>
                                    <div className="flex justify-between items-center ">
                                        {renderField("Website", "website", true)}
                                    </div>
                                </div>
                                {/* Github  link of user  */}
                                <div className="grid grid-cols-2 max-sm:grid-cols-1 w-full px-2  justify-between text-left  py-4 border-b-1 border-gray-300 ">
                                    <span className="flex items-center gap-1 "><Github size={18} />Github</span>
                                    <div className="flex justify-between items-center ">

                                        {renderField("Github", "github", true)}
                                    </div>
                                </div>
                                {/* Linkedin link of user  */}
                                <div className="grid grid-cols-2 max-sm:grid-cols-1 w-full px-2  justify-between text-left  py-4 border-b-1 border-gray-300 ">
                                    <span className="flex items-center gap-1"><Linkedin size={18} />Linkedin</span>
                                    <div className="flex justify-between items-center ">

                                        {renderField("Linkedin", "linkedin", true)}

                                    </div>
                                </div>
                                {/* twitter link of user  */}
                                <div className="grid grid-cols-2 max-sm:grid-cols-1 w-full px-2  justify-between text-left  py-4 border-b-1 border-gray-300 ">
                                    <span className="flex items-center gap-1"><Twitter size={18} />Twitter</span>
                                    <div className="flex justify-between items-center ">
                                        {renderField("Twitter", "x_twitter", true)}
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* Account info  */}
                        {openTab === 'account' && (
                            <div className="flex flex-col mt-4 bg-gray-100/0   py-2 rounded-xl px-1  ">
                                <h4 className={`text-left px-2 font-medium text-sm   max-md:hidden py-2 rounded 
                                            
                                            ${theme == 'dark' ? 'bg-gray-200/30 text-white ' : 'text-primary bg-gray-200 '}`}>Account</h4>


                                <div className="grid grid-cols-2 max-sm:grid-cols-1 w-full px-2  justify-between text-left  py-4 border-b-1 border-gray-300 ">
                                    <span>User Name</span>
                                    <div className="flex justify-between items-center ">

                                        {renderField("User Name", "userName")}

                                    </div>
                                </div>
                                <div className="grid grid-cols-2 max-sm:grid-cols-1 w-full px-2  justify-between text-left  py-4 border-b-1 border-gray-300">
                                    <span>Email</span>
                                    <div className="flex justify-between items-center ">
                                        <span className="text-gray-600 text-left  ">{user?.emailId}</span>


                                    </div>
                                </div>

                                <div className="grid grid-cols-2 max-sm:grid-cols-1 w-full px-2  justify-between text-left  py-4 border-b-1 border-gray-300 ">
                                    <span>Password</span>

                                    <NavLink to={'/profile/account/changePassword'}
                                        className=" btn-primary btn btn-sm btn-soft"
                                    >Change Password

                                    </NavLink>
                                </div>


                                <button className="btn btn-error  mt-4 sm:w-6/24 btn-sm btn-outline" onClick={openDeleteModal}>Delete Account</button>
                            </div>
                        )}

                    </div>
                </div>
            </div>


            {/* Delete Confirmation Modal */}
            <dialog id="delete_user_modal" className="modal">
                <div className={`modal-box  ${theme === 'dark' ? 'bg-black border border-gray-100/20 text-white' : 'bg-white text-black'}`}>
                    <TriangleAlert className="mx-auto  " size={50} color='red' />
                    <h3 className="font-bold text-lg text-center mt-2">Confirm Deletion</h3>
                    <p className="py-4 text-center">
                        Are you sure you want to delete the user <br />
                        <span className="font-semibold">{selectedUser?.userName}</span>?
                        <br /> This action cannot be undone.
                    </p>
                    <div className="modal-action justify-center">
                        <form method="dialog">
                            <button className="btn btn-outline mr-2" onClick={() => setSelectedUser(null)}>Cancel</button>
                        </form>
                        <button className="btn btn-error" onClick={confirmDelete}>
                            Delete User
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setSelectedUser(null)}>close</button>
                </form>
            </dialog>

            <Footer />
        </>
    )
}

export default Profile;
