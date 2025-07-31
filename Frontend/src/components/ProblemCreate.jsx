


import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import {

    Image as ImageIcon,
    ArrowRight,

} from 'lucide-react'
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { toast, Toaster } from 'react-hot-toast';

const problemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    tags: z.enum(['array', 'linkedList', 'graph', 'stack', 'math', 'string', 'dp']),
    visibleTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required'),
            explanation: z.string().min(1, 'Explanation is required')
        })
    ).min(1, 'At least one visible test case required'),
    hiddenTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required')
        })
    ).min(1, 'At least one hidden test case required'),
    startCode: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            initialCode: z.string().min(1, 'Initial code is required')
        })
    ).length(3, 'All three languages required'),
    referenceSolution: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            completeCode: z.string().min(1, 'Complete code is required')
        })
    ).length(3, 'All three languages required')
});

function ProblemCreate() {
    const { theme } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            visibleTestCases: [{ input: '', output: '', explanation: '' }],
            hiddenTestCases: [{ input: '', output: '' }],
            startCode: [
                { language: 'C++', initialCode: '' },
                { language: 'Java', initialCode: '' },
                { language: 'JavaScript', initialCode: '' }
            ],
            referenceSolution: [
                { language: 'C++', completeCode: '' },
                { language: 'Java', completeCode: '' },
                { language: 'JavaScript', completeCode: '' }
            ]
        }
    });

    const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestCases' });
    const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddenTestCases' });

    const onSubmit = async (data) => {
        try {

            await axiosClient.post('/problem/create', data);
            toast.success('Problem created successfully!');

        } catch (error) {

            console.error("Problem creation failed:", error.response || error);
            toast.error(`Error: ${error.response?.data?.message || error.response?.data || error.message}`);
        }
    };

    const isDark = theme === 'dark';
    const themeClasses = {
        page: isDark ? 'bg-black text-gray-300' : 'bg-gray-100/0 text-black',
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
            <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
                <AdminHeader openTab={`Problem-Create`} />
                <div className='flex'>
                    <AdminSidebar />
                    <div className={`min-h-screen mx-auto max-w-5xl p-2 sm:p-6 w-full ${themeClasses.page}`}>
                        <div className="container max-w-full">
                            <h1 className="text-2xl font-semibold mb-6 md:text-3xl text-center">Create New Problem</h1>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className={`card shadow p-6 rounded-lg border ${themeClasses.card}`}>
                                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className={`label ${themeClasses.label}`}><span className="label-text">Title</span></label>
                                            <input {...register('title')} placeholder="e.g., Two Sum" className={`input w-full ${themeClasses.input} ${errors.title ? 'input-error' : ''}`} />
                                            {errors.title && <span className="text-error text-sm mt-1">{errors.title.message}</span>}
                                        </div>
                                        <div>
                                            <label className={`label ${themeClasses.label}`}><span className="label-text">Description</span></label>
                                            <textarea {...register('description')} placeholder="Provide a clear and detailed problem description..." className={`textarea h-32 w-full ${themeClasses.input} ${errors.description ? 'textarea-error' : ''}`} />
                                            {errors.description && <span className="text-error text-sm mt-1">{errors.description.message}</span>}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className={`label ${themeClasses.label}`}><span className="label-text">Difficulty</span></label>
                                                <select {...register('difficulty')} className={`select w-full ${themeClasses.input} ${errors.difficulty ? 'select-error' : ''}`}>
                                                    <option value="easy">Easy</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="hard">Hard</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={`label ${themeClasses.label}`}><span className="label-text">Tag</span></label>
                                                <select {...register('tags')} className={`select w-full ${themeClasses.input} ${errors.tags ? 'select-error' : ''}`}>
                                                    <option value="array">Array</option>
                                                    <option value="linkedList">Linked List</option>
                                                    <option value="graph">Graph</option>
                                                    <option value="dp">DP</option>
                                                    <option value="stack">Stack</option>
                                                    <option value="math">Math</option>
                                                    <option value="string">String</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`card shadow p-6 rounded-lg border ${themeClasses.card}`}>
                                    <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center"><h3 className="font-medium">Visible Test Cases</h3><button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-sm btn-primary">Add</button></div>
                                        {visibleFields.map((field, index) => (
                                            <div key={field.id} className={`p-4 rounded-lg space-y-3 border ${themeClasses.card}`}>
                                                <div className="flex justify-between items-center"><p className="text-sm font-medium">Case #{index + 1}</p><button type="button" onClick={() => removeVisible(index)} className="btn btn-xs btn-error">Remove</button></div>
                                                <textarea {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className={`textarea w-full font-mono ${themeClasses.input}`} rows={2} />
                                                <textarea {...register(`visibleTestCases.${index}.output`)} placeholder="Output" className={`textarea w-full font-mono ${themeClasses.input}`} rows={2} />
                                                <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation" className={`textarea w-full ${themeClasses.input}`} rows={3} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center"><h3 className="font-medium">Hidden Test Cases</h3><button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn btn-sm btn-primary">Add</button></div>
                                        {hiddenFields.map((field, index) => (
                                            <div key={field.id} className={`p-4 rounded-lg space-y-3 border ${themeClasses.card}`}>
                                                <div className="flex justify-between items-center"><p className="text-sm font-medium">Case #{index + 1}</p><button type="button" onClick={() => removeHidden(index)} className="btn btn-xs btn-error">Remove</button></div>
                                                <textarea {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className={`textarea w-full font-mono ${themeClasses.input}`} rows={2} />
                                                <textarea {...register(`hiddenTestCases.${index}.output`)} placeholder="Output" className={`textarea w-full font-mono ${themeClasses.input}`} rows={2} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={`card shadow p-6 rounded-lg border ${themeClasses.card}`}>
                                    <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
                                    <div className="space-y-6">{['C++', 'Java', 'JavaScript'].map((lang, index) => (<div key={index} className="space-y-2"><h3 className="font-medium">{lang}</h3><div><label className={`label ${themeClasses.label}`}><span className="label-text">Initial Code</span></label><pre className={`p-4 rounded-lg ${themeClasses.codeBlock}`}><textarea {...register(`startCode.${index}.initialCode`)} className={`w-full bg-transparent font-mono focus:outline-none ${themeClasses.codeText}`} rows={8} /></pre></div><div><label className={`label ${themeClasses.label}`}><span className="label-text">Reference Solution</span></label><pre className={`p-4 rounded-lg ${themeClasses.codeBlock}`}><textarea {...register(`referenceSolution.${index}.completeCode`)} className={`w-full bg-transparent font-mono focus:outline-none ${themeClasses.codeText}`} rows={8} /></pre></div></div>))}</div>
                                </div>

                                    <div className='flex gap-4 justify-around flex-col md:flex-row items-center  '>
                                <button
                                    type="button"
                                    className="btn btn-outline w-75 "
                                    onClick={() => {
                                        reset();
                                    }}
                                >
                                    Clear Form
                                </button>
                                <button type="submit" className="btn btn-primary w-74  sm:w-xl "
                                    disabled={isSubmitting}
                                >Create Problem</button>

                                
</div>


                            </form>
                        </div>
                    </div>
                </div>
            </div>


            {/* when problem is create open modal  */}
            <div className={`modal ${isSubmitting ? 'modal-open' : ''}`}>
                <div className={`modal-box ${themeClasses.modalBox}`}>
                    <div className="flex flex-col items-center justify-center  gap-4">
                        <h3 className="font-bold text-lg text-center">Problem is Creating  </h3>
                        <span className="loading loading-spinner loading-md"></span>
                        <div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ProblemCreate;