


import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { toast, Toaster } from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';


const problemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    tags: z.enum(['array', 'linkedList', 'graph','stack','math' ,'string','dp']),
    visibleTestCases: z.array(z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
        explanation: z.string().min(1, 'Explanation is required')
    })).min(1, 'At least one visible test case is required'),
    hiddenTestCases: z.array(z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required')
    })).min(1, 'At least one hidden test case is required'),
    startCode: z.array(z.object({
        language: z.enum(['C++', 'Java', 'JavaScript']),
        initialCode: z.string().min(1, 'Initial code is required')
    })),
    referenceSolution: z.array(z.object({
        language: z.enum(['C++', 'Java', 'JavaScript']),
        completeCode: z.string().min(1, 'Reference solution is required')
    }))
});


function ProblemUpdate() {
    const { theme } = useSelector((state) => state.auth);
    const { problemId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        control,
        reset,
        getValues,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(problemSchema),
        mode: 'onBlur',
        defaultValues: {
            title: '',
            description: '',
            difficulty: 'easy',
            tags: 'array',
            visibleTestCases: [],
            hiddenTestCases: [],
            startCode: [
                { language: 'C++', initialCode: '' },
                { language: 'Java', initialCode: '' },
                { language: 'JavaScript', initialCode: '' },
            ],
            referenceSolution: [
                { language: 'C++', completeCode: '' },
                { language: 'Java', completeCode: '' },
                { language: 'JavaScript', completeCode: '' },
            ],
        },
    });


    useEffect(() => {
        const fetchProblemData = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get(`/problem/problemById/${problemId}`);
                reset(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch problem data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblemData();
    }, [problemId, reset]);

    const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestCases' });
    const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddenTestCases' });



    const handleUpdateSection = async (data, sectionName) => {
        console.log("Sending this full data object to backend:", data);
        setIsLoading(true)
        try {
            await axiosClient.put(`/problem/update/${problemId}`, data);
            setIsLoading(false)
            toast.success(`${sectionName} updated successfully!`);
        } catch (error) {

            const errorMessage = error.response?.data || error.message;
            toast.error(`Error updating ${sectionName}: ${errorMessage}`);
        }
    };

    const onUpdateBasicInfo = async () => {
        const isValid = await trigger(['title', 'description', 'difficulty', 'tags']);
        if (isValid) {
            const allData = getValues(); 
            handleUpdateSection(allData, 'Basic Information'); 
        }
    };


    const onUpdateTestCases = async () => {
        const isValid = await trigger(['visibleTestCases', 'hiddenTestCases']);
        if (isValid) {
            const allData = getValues(); 
            handleUpdateSection(allData, 'Test Cases'); 
        }
    };

   
    const onUpdateCode = async () => {
        const isValid = await trigger(['startCode', 'referenceSolution']);
        if (isValid) {
            const allData = getValues(); 
            handleUpdateSection(allData, 'Code Templates'); 
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
        modalBox: isDark ? 'bg-black  border border-gray-100/10' : 'bg-white text-black',
    };


      if (loading) return (
    // <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>

    <div className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} min-h-screen`}>
      <AdminHeader openTab={`Problem's Video's`} />
      <div className='flex'>
        <AdminSidebar />

        <div className='flex-grow p-2 sm:p-4 md:p-6 lg:p-8'>
          <div className="container max-w-5xl mx-auto">


      <div className='animate-pulse bg-gray-300/30 px-12 py-7 mx-auto mt-4  ' ></div>


       {/* <div className="hidden md:grid md:grid-cols-12 gap-4 px-12 p-6 font-medium text-xs uppercase">
                  <div className="col-span-1 animate-pulse bg-gray-300/50"></div>
                  <div className="col-span-4 animate-pulse bg-gray-300/50"></div>
                  <div className="col-span-2 p-4 animate-pulse bg-gray-300/50"></div>
                  <div className="col-span-2 p-4 animate-pulse bg-gray-300/50"></div>
                  <div className="col-span-3 text-center p-4 animate-pulse bg-gray-300/50"> </div>
                </div> */}
      
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
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className={`${theme == 'dark' ? 'bg-black' : 'bg-white'}`}>
                <AdminHeader openTab={`Problem-Update`} />
                <div className='flex'>
                    <AdminSidebar />

                    <div className={`min-h-screen max-w-5xl w-full p-4  mx-auto md:p-6 transition-colors duration-300 ${themeClasses.page}`}>
                        <div className="container mx-auto max-w-4xl">
                            <h1 className="text-3xl font-bold mb-6">Update Problem</h1>

                            <div className="space-y-8">

                                <div className={`card shadow p-6 rounded-lg border ${themeClasses.card}`}>
                                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className={`label ${themeClasses.label}`}><span className="label-text">Title</span></label>
                                            <input {...register('title')} className={`input w-full ${themeClasses.input} ${errors.title ? 'input-error' : ''}`} />
                                            {errors.title && <span className="text-error text-sm mt-1">{errors.title.message}</span>}
                                        </div>
                                        <div>
                                            <label className={`label ${themeClasses.label}`}><span className="label-text">Description</span></label>
                                            <textarea {...register('description')} className={`textarea h-32 w-full ${themeClasses.input} ${errors.description ? 'textarea-error' : ''}`} />
                                            {errors.description && <span className="text-error text-sm mt-1">{errors.description.message}</span>}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className={`label ${themeClasses.label}`}><span className="label-text">Difficulty</span></label>
                                                <select {...register('difficulty')} className={`select w-full ${themeClasses.input}`}>
                                                    <option value="easy">Easy</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="hard">Hard</option>
                                                </select>
                                            </div>
                                            

                                                   <div>
                                    <label className={`label  ${themeClasses.label}`}><span className="label-text">Tag</span></label>
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
                                    <div className="flex justify-end mt-6">
                                        <button type="button" onClick={onUpdateBasicInfo} className="btn btn-secondary">
                                            Update Basic Info
                                        </button>
                                    </div>
                                </div>


                                <div className={`card shadow p-6 rounded-lg border ${themeClasses.card}`}>
                                    <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
                                    <div className="space-y-4 mb-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <h3 className="font-medium">Visible Test Cases</h3>
                                            <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-sm btn-primary">Add Visible Case</button>
                                        </div>
                                        {visibleFields.map((field, index) => (
                                            <div key={field.id} className={`p-4 rounded-lg space-y-3 border ${themeClasses.card}`}>
                                                <div className="flex justify-between items-center"><p className="text-sm font-medium">Case #{index + 1}</p><button type="button" onClick={() => removeVisible(index)} className="btn btn-xs btn-error">Remove</button></div>
                                                <textarea {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className={`textarea w-full font-mono ${themeClasses.input}`} rows={2} />
                                                {errors.visibleTestCases?.[index]?.input && <span className="text-error text-sm mt-1">{errors.visibleTestCases[index].input.message}</span>}
                                                <textarea {...register(`visibleTestCases.${index}.output`)} placeholder="Output" className={`textarea w-full font-mono ${themeClasses.input}`} rows={2} />
                                                {errors.visibleTestCases?.[index]?.output && <span className="text-error text-sm mt-1">{errors.visibleTestCases[index].output.message}</span>}
                                                <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation" className={`textarea w-full ${themeClasses.input}`} rows={3} />
                                                {errors.visibleTestCases?.[index]?.explanation && <span className="text-error text-sm mt-1">{errors.visibleTestCases[index].explanation.message}</span>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <h3 className="font-medium">Hidden Test Cases</h3>
                                            <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn btn-sm btn-primary">Add Hidden Case</button>
                                        </div>
                                        {hiddenFields.map((field, index) => (
                                            <div key={field.id} className={`p-4 rounded-lg space-y-3 border ${themeClasses.card}`}>
                                                <div className="flex justify-between items-center"><p className="text-sm font-medium">Case #{index + 1}</p><button type="button" onClick={() => removeHidden(index)} className="btn btn-xs btn-error">Remove</button></div>
                                                <textarea {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className={`textarea w-full font-mono ${themeClasses.input}`} rows={2} />
                                                {errors.hiddenTestCases?.[index]?.input && <span className="text-error text-sm mt-1">{errors.hiddenTestCases[index].input.message}</span>}
                                                <textarea {...register(`hiddenTestCases.${index}.output`)} placeholder="Output" className={`textarea w-full font-mono ${themeClasses.input}`} rows={2} />
                                                {errors.hiddenTestCases?.[index]?.output && <span className="text-error text-sm mt-1">{errors.hiddenTestCases[index].output.message}</span>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <button type="button" onClick={onUpdateTestCases} className="btn btn-secondary">
                                            Update Test Cases
                                        </button>
                                    </div>
                                </div>

                                <div className={`card shadow p-6 rounded-lg border ${themeClasses.card}`}>
                                    <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
                                    <div className="space-y-6">
                                        {['C++', 'Java', 'JavaScript'].map((lang, index) => (
                                            <div key={index} className="space-y-2">
                                                <h3 className="font-medium">{lang}</h3>
                                                <div>
                                                    <label className={`label ${themeClasses.label}`}><span className="label-text">Initial Code</span></label>
                                                    <pre className={`p-4 rounded-lg ${themeClasses.codeBlock}`}>
                                                        <textarea {...register(`startCode.${index}.initialCode`)} className={`w-full bg-transparent font-mono focus:outline-none ${themeClasses.codeText}`} rows={8} />
                                                    </pre>
                                                    {errors.startCode?.[index]?.initialCode && <span className="text-error text-sm mt-1">{errors.startCode[index].initialCode.message}</span>}
                                                </div>
                                                <div>
                                                    <label className={`label ${themeClasses.label}`}><span className="label-text">Reference Solution</span></label>
                                                    <pre className={`p-4 rounded-lg ${themeClasses.codeBlock}`}>
                                                        <textarea {...register(`referenceSolution.${index}.completeCode`)} className={`w-full bg-transparent font-mono focus:outline-none ${themeClasses.codeText}`} rows={8} />
                                                    </pre>
                                                    {errors.referenceSolution?.[index]?.completeCode && <span className="text-error text-sm mt-1">{errors.referenceSolution[index].completeCode.message}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <button type="button" onClick={onUpdateCode} className="btn btn-secondary">
                                            Update Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


<div className={`modal ${isLoading ? 'modal-open' : ''}`}>
    <div className={`modal-box ${themeClasses.modalBox} relative overflow-visible`}>
        <div className="flex flex-col items-center gap-4 p-6">
            <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-yellow-100/50 rounded-full animate-pulse"></div>
                <AlertCircle className="relative z-10 w-full h-full text-yellow-500 animate-pulse" />
            </div>

            <h3 className="text-xl font-bold text-center ">
                Processing Your Request
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                Please wait while we update your information...
            </p>

            <div className="flex space-x-2 justify-center items-center h-8">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            </div>

     
        </div>
    </div>
</div>
        </>
    );
}

export default ProblemUpdate;

