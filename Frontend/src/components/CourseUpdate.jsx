


import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import {
    X,
    Upload,
    DollarSign,
    Link,
    Plus,
    BookOpen,
    List,
    Edit2,
    Image as ImageIcon,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';


const courseUpdateSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    subTitle: z.string().min(10, 'Subtitle must be at least 10 characters'),
    chapters: z.array(
        z.object({
            chapterName: z.string().min(3, 'Chapter Name is Required'),
            chapterDetails: z.string().min(3, 'Chapter Details is Required'),
        })
    ).min(1, 'At least one chapter is required'),
    descriptions: z.array(
        z.object({
            descriptionTitle: z.string().min(3, 'Description Title is Required'),
            description: z.string().min(3, 'Description Details is Required'),
        })
    ).min(1, 'At least one description is required'),
    courseType: z.enum(['feature', 'learn', 'interview']),
    
    premium: z.enum(['true', 'false']),
    price: z.union([
        z.number().min(0),
        z.literal(0),
        z.literal('')
    ]).optional().transform(val => val === '' ? 0 : Number(val)), 
    image: z.instanceof(FileList).optional()
        .refine(
            (files) => !files || files.length === 0 || files[0]?.size <= 5 * 1024 * 1024,
            `Max file size is 5MB.`
        )
        .refine(
            (files) => !files || files.length === 0 || ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        ),
    courseUrl: z.string().min(1, 'Course URL is required')
}).superRefine((data, ctx) => {
    if (data.premium === 'true' && (data.price === undefined || data.price === null || data.price === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Price is required for premium courses",
            path: ["price"]
        });
    }
});

function CourseUpdate() {
    const { theme } = useSelector(state => state.auth);
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [imgUrl, setImgUrl] = useState(null); 
    const [isLoading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
        control,
        setValue
    } = useForm({
        resolver: zodResolver(courseUpdateSchema),
        defaultValues: {
            title: '',
            subTitle: '',
            chapters: [],
            descriptions: [],
            premium: 'true', 
            price: 0,
            courseType: 'feature',
            courseUrl: ''
        }
    });

    const {
        fields: chaptersFields,
        append: appendChapter,
        remove: removeChapter
    } = useFieldArray({ control, name: 'chapters' });

    const {
        fields: descriptionsFields,
        append: appendDescription,
        remove: removeDescription
    } = useFieldArray({ control, name: 'descriptions' });

    const premiumValue = watch('premium');
    const courseTypeValue = watch('courseType');
    const imageFile = watch('image');
    const imagePreview = imageFile?.[0] ? URL.createObjectURL(imageFile[0]) : imgUrl;

useEffect(() => {
    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/course/CourseById/${courseId}`);
            const courseData = response.data;

         
            const { image, ...dataToReset } = courseData;

            
            const transformedData = {
                ...dataToReset,
                premium: String(dataToReset.premium) 
            };
       
            reset(transformedData);

            
            setImgUrl(image?.url); 
            
            setError(null);
        } catch (err) {
            setError('Failed to fetch course data. Please try again later.');
            toast.error('Failed to fetch course data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    if (courseId) {
        fetchCourseData();
    }
}, [courseId, reset]);

    
    const onSubmit = async (data) => {
        console.log(data);
        try {
            const formData = new FormData();
            

            formData.append('title', data.title);
            formData.append('subTitle', data.subTitle);
          

             
            data.chapters.forEach((chapter, index) => {
                formData.append(`chapters[${index}][chapterName]`, chapter.chapterName);
                formData.append(`chapters[${index}][chapterDetails]`, chapter.chapterDetails);
            });
 
            
            data.descriptions.forEach((desc, index) => {
                formData.append(`descriptions[${index}][descriptionTitle]`, desc.descriptionTitle);
                formData.append(`descriptions[${index}][description]`, desc.description);
            });

            formData.append('courseType', data.courseType);
            formData.append('premium', data.premium);
            formData.append('price', data.premium === 'true' ? String(data.price) : '0');
            formData.append('courseUrl', data.courseUrl);

            
            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]);
            }

            
                     const response = await axios.put(`/course/update/${courseId}`, formData, {
                            baseURL: 'http://localhost:3000',
                            withCredentials: true,
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
            toast.success('Course updated successfully!');
         

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update the course.');
            console.error(error);
        }
    };

    const isDark = theme === 'dark';
    const themeClasses = {
        page: isDark ? 'bg-black text-gray-300 border-0' : 'bg-gray-100/0 text-black border-gray-200',
        card: isDark ? 'bg-gray-100/5 border-gray-100/20' : 'bg-white border-gray-200',
        label: isDark ? 'text-gray-400' : 'text-gray-600',
        input: isDark
            ? 'bg-black border-gray-100/20 text-gray-200 placeholder-gray-500 focus:border-white focus:ring-primary'
            : 'bg-white border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-primary',
        codeBlock: isDark ? 'bg-gray-200/10' : 'bg-gray-200',
        codeText: isDark ? 'text-gray-200' : 'text-gray-900',
        modalBox: isDark ? 'bg-black border border-gray-100/20 text-white' : 'bg-white text-black',
    };

     if (isLoading) return (
    // <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>

    <div className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} min-h-screen`}>
      <AdminHeader openTab={`Problem's Video's`} />
      <div className='flex'>
        <AdminSidebar />

        <div className='flex-grow p-2 sm:p-4 md:p-6 lg:p-8'>
          <div className="container max-w-5xl mx-auto">


      <div className='animate-pulse bg-gray-300/30 px-12 py-7 mx-auto mt-4  ' ></div>

      <div  className={` mt-5 py-50 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>   
      
      
     
      </div>
      <div  className={` mt-5 py-50 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>   
      
      
     
      </div>
     

          </div>

        </div>

      </div>
    </div>
    // <span className="loading loading-spinner loading-lg"></span></div>)
  )
    
  console.log("Form Errors:", errors);
  
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white text-black'}`}>
                <AdminHeader openTab={'Course Update'} />
                <div className='flex'>
                    <AdminSidebar />
                    <div className="min-h-screen w-full max-w-5xl mx-auto py-8 px-4">
                        <div className="mx-auto">
                            <h1 className="text-2xl font-semibold mb-6 md:text-3xl text-center">Update Course</h1>
                            <div className={`rounded-box overflow-hidden border ${themeClasses.page}`}>
                                <form onSubmit={handleSubmit(onSubmit)}className="p-6 px-4 space-y-8">
                                    <div className="grid grid-cols-1 gap-8">
                                        {/* Left Column - Course Details */}
                                        <div className="space-y-6">
                                            {/* Course Information Card */}
                                            <div className={`card p-6 shadow-sm gap-4 ${themeClasses.card}`}>
                                                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                                                    <Edit2 className="text-primary h-5 w-5" />
                                                    Course Information
                                                </h2>
                                                {/* Title */}
                                                <div className="form-control flex-col flex gap-2">
                                                    <label className={`label ${themeClasses.label}`}>
                                                        <span className="label-text font-medium">Course Title*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="e.g., Advanced React Patterns"
                                                            className={`input input-bordered w-full pl-10 ${themeClasses.input} ${errors.title ? 'input-error' : 'focus:ring-0 focus:ring-primary'}`}
                                                            {...register('title')}
                                                        />
                                                        <span className="absolute left-3 top-3 text-gray-500">
                                                            <BookOpen className="h-4 w-4" />
                                                        </span>
                                                    </div>
                                                    {errors.title && <label className="label"><span className="label-text-alt text-error">{errors.title.message}</span></label>}
                                                </div>

                                                {/* Subtitle */}
                                                <div className="form-control flex-col flex gap-2">
                                                    <label className={`label ${themeClasses.label}`}>
                                                        <span className="label-text font-medium">Subtitle*</span>
                                                    </label>
                                                    <textarea
                                                        placeholder="A comprehensive guide to mastering advanced React concepts..."
                                                        className={`textarea textarea-bordered w-full h-32 ${themeClasses.input} ${errors.subTitle ? 'textarea-error' : 'focus:ring-0 focus:ring-primary'}`}
                                                        {...register('subTitle')}
                                                    />
                                                    {errors.subTitle && <label className="label"><span className="label-text-alt text-error">{errors.subTitle.message}</span></label>}
                                                </div>

                                                {/* Course URL */}
                                                <div className="form-control flex-col flex gap-2">
                                                    <label className={`label ${themeClasses.label}`}>
                                                        <span className="label-text font-medium">Course URL*</span>
                                                    </label>
                                                    <div className="flex">
                                                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-base-300 text-gray-500"><Link className="h-4 w-4" /></span>
                                                        <input
                                                            type="text"
                                                            placeholder="advanced-react-patterns"
                                                            className={`input input-bordered rounded-l-none flex-1 ${themeClasses.input} ${errors.courseUrl ? 'input-error' : 'focus:ring-0 focus:ring-primary'}`}
                                                            {...register('courseUrl')}
                                                        />
                                                    </div>
                                                    {errors.courseUrl && <label className="label"><span className="label-text-alt text-error">{errors.courseUrl.message}</span></label>}
                                                </div>

                                                {/* Descriptions */}
                                                <div className="space-y-4 mb-6">
                                                    <div className="flex justify-between items-center">
                                                        <label className={`label ${themeClasses.label}`}><span className="label-text font-medium">Description of Course*</span></label>
                                                        <button type="button" onClick={() => appendDescription({ descriptionTitle: '', description: '' })} className="btn btn-sm btn-primary flex justify-between"><Plus /> Description</button>
                                                    </div>
                                                    {descriptionsFields.map((description, index) => (
                                                        <div key={description.id} className="border p-4 rounded-lg space-y-2">
                                                            <div className="flex justify-end"><button type="button" onClick={() => removeDescription(index)} className="btn btn-sm btn-ghost"><X /></button></div>
                                                            <input {...register(`descriptions.${index}.descriptionTitle`)} placeholder="Description Title" className={`input input-bordered w-full ${themeClasses.input} focus:ring-0 focus:ring-primary`} />
                                                            <textarea {...register(`descriptions.${index}.description`)} placeholder="Description" className={`textarea input-bordered w-full focus:ring-0 focus:ring-primary ${themeClasses.input}`} />
                                                        </div>
                                                    ))}
                                                    {errors.descriptions && <label className="label"><span className="label-text-alt text-error">{errors.descriptions.root?.message || "Please add at least one description."}</span></label>}
                                                </div>
                                            </div>

                                            {/* Content Structure Card */}
                                            <div className={`card p-6 shadow-sm ${themeClasses.card}`}>
                                                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><List className="text-secondary h-5 w-5" /> Content Structure</h2>
                                                {/* Chapters */}
                                                <div className="space-y-4 mb-6">
                                                    <div className="flex justify-between items-center">
                                                        <label className={`label ${themeClasses.label}`}><span className="label-text font-medium">Chapters in Course*</span></label>
                                                        <button type="button" onClick={() => appendChapter({ chapterName: '', chapterDetails: '' })} className="btn btn-sm btn-primary flex justify-between"><Plus /> Add</button>
                                                    </div>
                                                    {chaptersFields.map((chapter, index) => (
                                                        <div key={chapter.id} className="border p-4 rounded-lg space-y-2">
                                                            <div className="flex justify-end"><button type="button" onClick={() => removeChapter(index)} className="btn btn-sm btn-ghost"><X /></button></div>
                                                            <input {...register(`chapters.${index}.chapterName`)} placeholder="Chapter name" className={`input input-bordered w-full ${themeClasses.input} focus:ring-0 focus:ring-primary`} />
                                                            <textarea {...register(`chapters.${index}.chapterDetails`)} placeholder="Chapter Details" className={`textarea ${themeClasses.input} input-bordered w-full focus:ring-0 focus:ring-primary`} />
                                                        </div>
                                                    ))}
                                                    {errors.chapters && <label className="label"><span className="label-text-alt text-error">{errors.chapters.root?.message || "Please add at least one chapter."}</span></label>}
                                                </div>
                                            </div>

                                            {/* Course Type Card */}
                                            <div className={`card p-6 shadow-sm ${themeClasses.card}`}>
                                                <h2 className="text-xl font-semibold mb-4">Course Type*</h2>
                                                <div className="form-control flex gap-2 flex-col">
                                                    <label className={`label ${themeClasses.label}`}><span className="label-text font-medium">Select type of course</span></label>
                                                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-2">
                                                        <button type="button" className={`btn ${courseTypeValue === 'feature' ? 'btn-warning' : 'btn-outline btn-warning'}`} onClick={() => setValue('courseType', 'feature')}>Feature</button>
                                                        <button type="button" className={`btn ${courseTypeValue === 'learn' ? 'btn-success' : 'btn-outline btn-success'}`} onClick={() => setValue('courseType', 'learn')}>Learn</button>
                                                        <button type="button" className={`btn ${courseTypeValue === 'interview' ? 'btn-neutral' : 'btn-outline '}`} onClick={() => setValue('courseType', 'interview')}>Interview</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column - Settings & Media */}
                                        <div className="space-y-6">
                                            {/* Pricing Card */}
                                            <div className={`card p-6 shadow-sm ${themeClasses.card}`}>
                                                <h2 className="text-xl font-semibold mb-4">Pricing</h2>
                                                <div className="form-control flex-col flex gap-2">
                                                    <label className={`label ${themeClasses.label}`}><span className="label-text font-medium">Course Type*</span></label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button type="button" className={`btn ${premiumValue === 'true' ? 'btn-accent' : 'btn-outline btn-accent'}`} onClick={() => { setValue('premium', 'true'); setValue('price', ''); }}>Premium</button>
                                                        <button type="button" className={`btn ${premiumValue === 'false' ? 'btn-info' : 'btn-outline btn-info'}`} onClick={() => { setValue('premium', 'false'); setValue('price', 0); }}>Free</button>
                                                    </div>
                                                </div>

                                                {premiumValue === 'true' && (
                                                    <div className="form-control flex-col flex gap-2 mt-4">
                                                        <label className={`label ${themeClasses.label}`}><span className="label-text font-medium">Price (₹)</span></label>
                                                        <label className="input-group">
                                                            <span className={`bg-base-200 text-base-content ${themeClasses.label}`}><DollarSign size={20} /></span>
                                                            <input type="number" placeholder="999" className={`input input-bordered w-full ${themeClasses.input} ${errors.price ? 'input-error' : 'focus:ring-0 focus:ring-primary'}`} {...register('price', { valueAsNumber: true })} min="0" />
                                                        </label>
                                                        {errors.price && <label className="label"><span className="label-text-alt text-error">{errors.price.message}</span></label>}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Course Image Card */}
                                            <div className={`card p-6 shadow-sm ${themeClasses.card}`}>
                                                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><ImageIcon className="text-accent h-5 w-5" /> Course Cover Image</h2>
                                                <div className="form-control flex-col flex gap-2">
                                                    <label className="label"><span className="label-text font-medium">Upload New Image (Optional)</span></label>
                                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-40 h-40 max-md:w-full rounded-lg overflow-hidden border-2 border-dashed border-base-300 flex items-center justify-center">
                                                                {imagePreview ? <img src={imagePreview} alt="Course Preview" className="w-full h-full object-cover" /> : <div className="text-center p-4"><Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" /><p className="text-xs text-gray-500">Preview</p></div>}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="flex flex-col items-center justify-center w-full h-full p-6 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:bg-gray-300/20 transition-colors">
                                                                <div className="flex flex-col items-center justify-center">
                                                                    <Upload className="h-6 w-6 text-gray-500 mb-2" />
                                                                    <p className="text-sm text-gray-500"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                                                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (Max. 5MB)</p>
                                                                </div>
                                                                <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" {...register('image')} />
                                                            </label>
                                                            {errors.image && <label className="label"><span className="label-text-alt text-error">{errors.image.message}</span></label>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-6 border-t border-base-300">
                                        <button type="button" className="btn btn-ghost hover:bg-black hover:text-white transition" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-2" /> Back</button>
                                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                            <button     type="submit" className={`btn btn-primary px-8 ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
                                                {isSubmitting ? 'Updating...' : <>Update Course <ArrowRight className="h-4 w-4 ml-2" /></>}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submitting Modal */}
            <div className={`modal ${isSubmitting ? 'modal-open' : ''}`}>
                <div className={`modal-box ${themeClasses.modalBox}`}>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <h3 className="font-bold text-lg text-center">Updating Course...</h3>
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseUpdate;