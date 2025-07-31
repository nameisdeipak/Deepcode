
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import {
    X,
    Upload,
    DollarSign,
    Link,
    Plus, Cross,
    BookOpen,
    List,
    Percent,
    Edit2,
    Image as ImageIcon,
    ArrowRight,
    ArrowLeft
} from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast';

const courseSchema = z.object({
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
    ).min(1, 'At least one Desction is required'),
    courseType: z.enum(['feature', 'learn', 'interview']),
    progress: z.number().min(0).max(100),

    premium: z.enum(['true', 'false']),
    price: z.union([
        z.number().min(0),
        z.literal(0),
        z.literal('')
    ]).optional().transform(val => val === '' ? 0 : val),
    image: z.instanceof(FileList)
        .refine(files => files?.length === 1, 'Image is required')
        .refine(files => files[0]?.size <= 5 * 1024 * 1024, 'Max file size is 5MB')
        .refine(files => ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type)),
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

function CourseCreate() {

    const { user, theme } = useSelector(state => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
        control,
        setValue
    } = useForm({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            // status: 'draft',
            premium: 'true',
            courseType: 'feature',
            progress: 0
        }
    })

    const {
        fields: chaptersFields,
        append: appendChapter,
        remove: removeChapter
    } = useFieldArray({
        control,
        name: 'chapters'
    });

    const {
        fields: descriptionsFields,
        append: appendDescription,
        remove: removeDescription
    } = useFieldArray({
        control,
        name: 'descriptions'
    });

    const premiumValue = watch('premium')
    //   const progressValue = watch('progress')
    const statusValue = watch('status')
    const courseTypeValue = watch('courseType')
    const imagePreview = watch('image')?.[0] ? URL.createObjectURL(watch('image')[0]) : null

    const onSubmit = async (data) => {
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
            formData.append('price', data.premium === 'true' ? data.price.toString() : '0');
            formData.append('image', data.image[0]);
            formData.append('courseUrl', data.courseUrl);


            const response = await axios.post('/course/create', formData, {
                baseURL: 'http://localhost:3000',
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

         
              toast.success('Successfully course is create.');
                  reset();
        } catch (error) {
                  toast.error('Failed to create a course.');

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

    return (

        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className={`${theme == 'dark' ? 'bg-black' : 'bg-white text-black'}`}>
                <AdminHeader openTab={'Dashboard'} />

                <div className='flex  '>
                    <AdminSidebar />

                    <div className="min-h-screen w-full max-w-5xl mx-auto  py-8 px-4">
                        <div className=" mx-auto">
                            <h1 className="text-2xl font-semibold mb-6 md:text-3xl text-center">Create New Course</h1>

                            <div className={`rounded-box  overflow-hidden border ${themeClasses.page} `}>
                                {/* Header */}


                                <form onSubmit={handleSubmit(onSubmit)} className="p-6 px-4 space-y-8">

                                    <div className="grid grid-cols-1  gap-8">
                                        {/* Left Column - Course Details */}
                                        <div className="space-y-6">
                                            <div className={` card p-6 shadow-sm gap-4 ${themeClasses.card}`}>
                                                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                                                    <Edit2 className="text-primary h-5 w-5" />
                                                    Course Information
                                                </h2>

                                                {/* Title */}
                                                <div className="form-control flex-col flex gap-2">
                                                    <label className={`label ${themeClasses.label} `}>
                                                        <span className="label-text font-medium">Course Title*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="e.g., Advanced React Patterns"
                                                            className={`input input-bordered w-full pl-10  ${themeClasses.input}  ${errors.title ? 'input-error' : 'focus:ring-0 focus:ring-primary'}`}
                                                            {...register('title')}
                                                        />
                                                        <span className="absolute left-3 top-3 text-gray-500">
                                                            <BookOpen className="h-4 w-4" />
                                                        </span>
                                                    </div>
                                                    {errors.title && (
                                                        <label className={`label  `}>
                                                            <span className="label-text-alt text-error">{errors.title.message}</span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Subtitle */}
                                                <div className="form-control flex-col flex gap-2">
                                                    <label className={`label ${themeClasses.label} `}>
                                                        <span className="label-text font-medium">Subtitle*</span>
                                                    </label>
                                                    <textarea
                                                        placeholder="A comprehensive guide to mastering advanced React concepts..."
                                                        className={`textarea textarea-bordered w-full h-32  ${themeClasses.input}  ${errors.subTitle ? 'textarea-error' : 'focus:ring-0 focus:ring-primary'}`}
                                                        {...register('subTitle')}
                                                    />
                                                    {errors.subTitle && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">{errors.subTitle.message}</span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Course URL */}
                                                <div className="form-control flex-col flex gap-2">
                                                    <label className={`label ${themeClasses.label} `}>
                                                        <span className="label-text font-medium">Course URL*</span>
                                                    </label>
                                                    <div className="flex">
                                                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-base-300  text-gray-500">
                                                            <Link className="h-4 w-4" />
                                                        </span>
                                                        <input
                                                            type="text"
                                                            placeholder="advanced-react-patterns"
                                                            className={`input input-bordered rounded-l-none flex-1 ${themeClasses.input}  ${errors.courseUrl ? 'input-error' : 'focus:ring-0 focus:ring-primary'}`}
                                                            {...register('courseUrl')}
                                                        />
                                                    </div>
                                                    {errors.courseUrl && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">{errors.courseUrl.message}</span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Descriptons */}
                                                <div className="space-y-4 mb-6">
                                                    <div className="flex justify-between items-center ">
                                                        <label className={`label ${themeClasses.label} `}>
                                                            <span className="label-text font-medium">Descripton of Course*</span>
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => appendDescription({ descriptionTitle: '', description: '' })}
                                                            className="btn btn-sm btn-primary flex justify-between"
                                                        >
                                                            <Plus /> Description
                                                        </button>
                                                    </div>

                                                    {descriptionsFields.map((description, index) => (
                                                        <div key={description.id} className="border p-4 rounded-lg space-y-2">
                                                            <div className="flex justify-end">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeDescription(index)}
                                                                    className="btn btn-sm btn-ghost"
                                                                >
                                                                    <X />
                                                                </button>
                                                            </div>

                                                            <input
                                                                {...register(`descriptions.${index}.descriptionTitle`)}
                                                                placeholder="Description Title"
                                                                className={`input input-bordered w-full  ${themeClasses.input}    focus:ring-0 focus:ring-primary`}
                                                            />

                                                            <textarea
                                                                {...register(`descriptions.${index}.description`)}
                                                                placeholder="Description"
                                                                className={` textarea input-bordered w-full  focus:ring-0 focus:ring-primary  ${themeClasses.input} `}
                                                            />


                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Content Structure */}
                                            <div className={`card  p-6 shadow-sm ${themeClasses.card}`}>
                                                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                                                    <List className="text-secondary h-5 w-5" />
                                                    Content Structure
                                                </h2>

                                                {/* Chapters */}
                                                <div className="space-y-4 mb-6">
                                                    <div className="flex justify-between items-center">
                                                        <label className={`label ${themeClasses.label} `}>
                                                            <span className="label-text font-medium">Chapters in Course*</span>
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => appendChapter({ chapterName: '', chapterDetails: '' })}
                                                            className="btn btn-sm btn-primary flex justify-between"
                                                        >
                                                            <Plus /> Add
                                                        </button>
                                                    </div>

                                                    {chaptersFields.map((chapter, index) => (
                                                        <div key={chapter.id} className="border p-4 rounded-lg space-y-2">
                                                            <div className="flex justify-end">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeChapter(index)}
                                                                    className="btn btn-sm btn-ghost"
                                                                >
                                                                    <X />
                                                                </button>
                                                            </div>

                                                            <input
                                                                {...register(`chapters.${index}.chapterName`)}
                                                                placeholder="Chapter name"
                                                                className={`input input-bordered w-full  ${themeClasses.input}   focus:ring-0 focus:ring-primary`}
                                                            />

                                                            <textarea
                                                                {...register(`chapters.${index}.chapterDetails`)}
                                                                placeholder="Chapter Details"
                                                                className={`textarea  ${themeClasses.input}   input-bordered w-full  focus:ring-0 focus:ring-primary`}
                                                            />


                                                        </div>
                                                    ))}
                                                </div>                                                
                                            </div>

                                            {/* Course Type */}
                                            <div className={`card  p-6 shadow-sm ${themeClasses.card}`}>
                                                <h2 className="text-xl font-semibold mb-4">Course Type*</h2>

                                                <div className="form-control flex gap-2 flex-col">
                                                    <label className={`label ${themeClasses.label} `}>
                                                        <span className="label-text font-medium">Select type of course</span>
                                                    </label>
                                                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-2">
                                                        <button
                                                            type="button"
                                                            className={`btn ${courseTypeValue === 'feature' ? 'btn-warning' : 'btn-outline btn-warning'}`}
                                                            onClick={() => setValue('courseType', 'feature')}
                                                        >
                                                            Feature
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn ${courseTypeValue === 'learn' ? 'btn-success' : 'btn-outline btn-success'}`}
                                                            onClick={() => setValue('courseType', 'learn')}
                                                        >
                                                            Learn
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn ${courseTypeValue === 'interview' ? 'btn-neutral' : 'btn-outline '}`}
                                                            onClick={() => setValue('courseType', 'interview')}
                                                        >
                                                            Interview
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Right Column - Settings & Media */}
                                        <div className="space-y-6">
                                

                                            {/* Pricing */}
                                            <div className={`card  p-6 shadow-sm ${themeClasses.card}`}>
                                                <h2 className="text-xl font-semibold mb-4">Pricing</h2>

                                                <div className="form-control flex-col flex gap-2">
                                                    <label className={`label ${themeClasses.label} `}>
                                                        <span className="label-text font-medium">Course Type*</span>
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            type="button"
                                                            className={`btn ${premiumValue === 'true' ? 'btn-accent' : 'btn-outline btn-accent'}`}
                                                            onClick={() => {
                                                                setValue('premium', 'true');
                                                                setValue('price', ''); 
                                                            }}
                                                        >
                                                            Premium
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn ${premiumValue === 'false' ? 'btn-info' : 'btn-outline btn-info'}`}
                                                            onClick={() => {
                                                                setValue('premium', 'false');
                                                                setValue('price', 0); 
                                                            }}
                                                        >
                                                            Free
                                                        </button>
                                                    </div>
                                                </div>

                                                {premiumValue === 'true' && (
                                                    <div className="form-control flex-col flex gap-2 mt-4">
                                                        <label className={`label ${themeClasses.label} `}>
                                                            <span className="label-text font-medium">Price (₹)</span>
                                                        </label>
                                                        <label className="input-group">
                                                            <span className={`"bg-primary  text-primary-content"  ${themeClasses.label} `}>
                                                                <DollarSign size={20} />
                                                            </span>
                                                            <input
                                                                type="number"
                                                                placeholder="999"
                                                                className={`input input-bordered w-full  ${themeClasses.input}  ${errors.price ? 'input-error' : 'focus:ring-0 focus:ring-primary'}`}
                                                                {...register('price', {
                                                                    valueAsNumber: true,
                                                                    required: premiumValue === 'true' ? "Price is required for premium courses" : false
                                                                })}
                                                                min="0"
                                                            />
                                                        </label>
                                                        {errors.price && (
                                                            <label className="label">
                                                                <span className="label-text-alt text-error">{errors.price.message}</span>
                                                            </label>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Course Image */}
                                            <div className={`card  p-6 shadow-sm ${themeClasses.card}`}>
                                                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                                                    <ImageIcon className="text-accent h-5 w-5" />
                                                    Course Cover Image
                                                </h2>

                                                <div className="form-control flex-col flex gap-2">
                                                    <label className="label">
                                                        <span className="label-text font-medium">Upload Image*</span>
                                                    </label>

                                                    <div className="flex flex-col sm:flex-row justify-center gap-4 ">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-40 h-40 max-md:w-full rounded-lg overflow-hidden border-2 border-dashed border-base-300 flex items-center justify-center">
                                                                {imagePreview ? (
                                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="text-center p-4">
                                                                        <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                                                                        <p className="text-xs text-gray-500">Preview</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex-1">
                                                            <label className="flex flex-col items-center justify-center w-full h-full p-6 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors">
                                                                <div className="flex flex-col items-center justify-center">
                                                                    <Upload className="h-6 w-6 text-gray-500 mb-2" />
                                                                    <p className="text-sm text-gray-500">
                                                                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (Max. 5MB)</p>
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    accept="image/jpeg, image/png, image/webp"
                                                                    className="hidden"
                                                                    {...register('image')}
                                                                />
                                                            </label>
                                                            {errors.image && (
                                                                <label className="label">
                                                                    <span className="label-text-alt text-error">{errors.image.message}</span>
                                                                </label>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-6 border-t border-base-300">
                                        <button
                                            type="button"
                                            className="btn btn-ghost hover:bg-black hover:text-white transition   "
                                            onClick={() => window.history.back()}
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Back to
                                        </button>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                className="btn btn-outline"
                                                onClick={() => {
                                                    setValue('title', '')
                                                    setValue('subTitle', '')
                                                    setValue('chapters', 0)
                                                    setValue('items', 0)
                                                    reset();
                                                }}
                                            >
                                                Clear Form
                                            </button>
                                            <button
                                                type="submit"
                                                className={`btn btn-primary px-8 `}
                                             
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    'Creating Course...'
                                                ) : (
                                                    <>
                                                        Create Course
                                                        <ArrowRight className="h-4 w-4 ml-2" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className={`modal ${isSubmitting ? 'modal-open' : ''}`}>
                <div className={`modal-box ${themeClasses.modalBox}`}>
                    <div className="flex flex-col items-center justify-center  gap-4">
       
                            <h3 className="font-bold text-lg text-center">Course is Creating  </h3>
                            <span className="loading loading-spinner loading-md"></span>
                        <div>
                     
                        </div>
                    </div>
                  
                </div>
            </div>
        </>
    )
}

export default CourseCreate;
