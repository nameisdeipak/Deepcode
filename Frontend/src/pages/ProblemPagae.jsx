

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useSelector ,useDispatch} from 'react-redux';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from '../components/SubmissionHistory';
import ChatAi from '../components/ChatAi';
import YouTubeStylePlayer from '../components/VideoPlayer';
import Header from '../components/Header';
import { clearChat } from "../aiChatSlice";


import { Settings, Copy, Expand, Play, Send, Loader2, Info, Tags, ChevronDown, CheckCircle2, XCircle, Bot, X } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import screenfull from 'screenfull';
import { Toaster, toast } from 'react-hot-toast';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const { theme } = useSelector(state => state.auth);
  const { problemId } = useParams();
  
    const dispatch = useDispatch();


  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');


  const [activeBottomTab, setActiveBottomTab] = useState('testcases');
  const [fontSize, setFontSize] = useState(14);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);


  const editorRef = useRef(null);
  const editorContainerRef = useRef(null); 
  const hasFetchedRef = useRef(false);


  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage])?.initialCode || '// Write your code here';
        setProblem(response.data);
        setCode(initialCode);
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetchedRef.current && problemId) {
      hasFetchedRef.current = true;
      fetchProblem();
    }
    dispatch(clearChat());

  }, [problemId, selectedLanguage]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage])?.initialCode || "// Write your code here";
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  // --- Handlers ---
  const handleEditorChange = (value) => setCode(value || '');
  const handleEditorDidMount = (editor) => (editorRef.current = editor);
  const handleLanguageChange = (language) => setSelectedLanguage(language);

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    setActiveBottomTab('testcases');
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
      setRunResult(response.data);
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({ success: false, error: 'An error occurred while running the code.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    setActiveBottomTab('result');
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
      setSubmitResult(response.data);
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({ accepted: false, error: 'An error occurred during submission.' });
    } finally {
      setLoading(false);
    }
  };

  // --- New handlers for editor features ---
  const handleCopyCode = () => {
    if (navigator.clipboard && code) {
      navigator.clipboard.writeText(code).then(() => {
        toast.success('Code copied to clipboard!');
      });
    } else {
      toast.error('Could not copy code.');
    }
  };

  const handleFullscreen = () => {
    if (screenfull.isEnabled && editorContainerRef.current) {
      screenfull.toggle(editorContainerRef.current);
    }
  };



  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'F11') {
        event.preventDefault();
        handleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  const getLanguageForMonaco = (lang) => ({ javascript: 'javascript', java: 'java', cpp: 'cpp' }[lang] || 'javascript');
  const getDifficultyColor = (difficulty) => ({ easy: 'text-green-500', medium: 'text-yellow-500', hard: 'text-red-500' }[difficulty] || 'text-gray-500');


  const themeClasses = {
    bg: theme === 'dark' ? 'bg-black' : 'bg-white',
    text: theme === 'dark' ? 'text-gray-200' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    textActive: theme === 'dark' ? 'text-white' : 'text-black',
    border: theme === 'dark' ? 'border-gray-200/30' : 'border-gray-300',
    panelBg: theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-gray-50',
    hover: theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    inputBg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100',
    resizeHandle: theme === 'dark' ? 'bg-gray-900 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300',
    activeTabBorder: theme === 'dark' ? 'border-white' : 'border-black'
  };

  if (loading && !problem) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${themeClasses.bg}`}>
        <Loader2 className={`animate-spin h-10 w-10 ${themeClasses.text}`} />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? 'white' : 'black' }
      }} />
      <Header />
      <div className={`flex  flex-col p-4 h-screen ${themeClasses.bg} ${themeClasses.text}`}>
        <main className="flex-1  overflow-hidden">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={40} minSize={30} >
              <div className={` ${themeClasses.border} border overflow-hidden h-full rounded flex flex-col `}>
                <div className={`flex-shrink-0 flex items-center justify-around border-b ${themeClasses.border} px-2`}>
                  {['description', 'editorial', 'solutions', 'submissions'].map(tab => (
                    <button key={tab} onClick={() => setActiveLeftTab(tab)} className={`py-3 px-4 text-sm font-medium transition-colors ${activeLeftTab === tab ? `${themeClasses.textActive} border-b-2 ${themeClasses.activeTabBorder}` : `${themeClasses.textSecondary} hover:${themeClasses.textActive}`}`}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace('AI', ' AI')}
                    </button>
                  ))}
                </div>
                <div className={`flex-1 w-auto overflow-y-auto p-6 prose dark:prose-invert max-w-none ${themeClasses.text}`}>

                  {problem && (
                    <>
                      {activeLeftTab === 'description' && (
                        <div>
                          <div className="flex flex-col   items-start gap-4 mb-6">
                            <h1 className={`text-2xl font-bold ${themeClasses.textActive}`}>{problem.title}</h1>
                            <div className='flex gap-4'>
                              <span className={`font-normal  ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
                              <span className=" text-sm  font-mono  flex justify-center gap-2 items-center   px-2 py-1 rounded">
                                <Tags size={20} />  {problem.tags}</span>
                            </div>
                          </div>
                          <p>{problem.description}</p>
                          <h3 className={`text-lg font-semibold mt-8 mb-4 ${themeClasses.textActive}`}>Examples:</h3>
                          {problem.visibleTestCases.map((example, index) => (
                            <div key={index} className={`p-4 rounded-lg mb-4 ${themeClasses.panelBg}`}>
                              <h4 className={`font-semibold mb-2 ${themeClasses.textActive}`}>Example {index + 1}:</h4>
                              <pre className="text-sm font-mono whitespace-pre-wrap">
                                <strong>Input:</strong> {example.input}<br />
                                <strong>Output:</strong> {example.output}<br />
                                <strong>Explanation:</strong> {example.explanation}
                              </pre>
                            </div>
                          ))}
                        </div>
                      )}
                  
                      {activeLeftTab === 'editorial' && (

                        <div className="prose max-w-none">
                          {problem?.secureUrl  ? (<>
                            <h2 className="text-xl font-bold mb-4">Editorial</h2>
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {'Editorial is here for the problem'}
                              <h4 className='text-xl font-semibold pb-4'>{problem?.title}</h4>
                            </div>
                            <YouTubeStylePlayer videoId={problem?.videoId} videoUrl={problem?.secureUrl} thumbnailUrl={problem.thumbnailUrl}></YouTubeStylePlayer>
                          </>) : (
                            <div className='flex gap-5 justify-center pt-[10%] items-center flex-col'>
                              <Info size={50} color='gray'/>
                              <p>
                                Not Present editorial of This Problem
                              </p>
                            </div> 
                          )}
                        </div>

                      )}

                      {activeLeftTab === 'solutions' && (
                        <div>
                          <h2 className={`text-2xl font-bold mb-6 ${themeClasses.textActive}`}>Solutions</h2>
                          <div className="space-y-6">
                            {problem.referenceSolution && problem.referenceSolution.length > 0 ? (
                              problem.referenceSolution.map((solution, index) => (
 
                                <div key={index} className={`rounded-lg border ${themeClasses.border} overflow-hidden`}>
                                  {/* macOS-style Header */}
                                  <div className={`flex items-center gap-4 px-4 py-2 ${themeClasses.panelBg} border-b ${themeClasses.border}`}>
                                    {/* Dots */}
                                    <div className="flex gap-1.5">
                                      <span className="block h-3 w-3 rounded-full bg-red-500"></span>
                                      <span className="block h-3 w-3 rounded-full bg-yellow-500"></span>
                                      <span className="block h-3 w-3 rounded-full bg-green-500"></span>
                                    </div>
                                    {/* Title and Language */}
                                    <div className={`text-center text-sm font-medium ${themeClasses.textSecondary}`}>
                                      {problem?.title} - {solution?.language}
                                    </div>
                                  </div>

                                  {/* Code Block */}
                                  <div className={`${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-gray-50'}`}>
                                    <pre className="p-4 text-sm overflow-x-auto">
                                      <code className="font-mono">{solution?.completeCode}</code>
                                    </pre>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className={`${themeClasses.textSecondary}`}>
                                <Info />
                                Solutions will be available after you solve the problem.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      {activeLeftTab === 'submissions' && <SubmissionHistory problemId={problemId} />}
                   
                    </>
                  )}
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className={`w-2 transition-colors ${themeClasses.resizeHandle}`} />


            <Panel defaultSize={60} minSize={30}>
              <div className={` ${themeClasses.border} border overflow-hidden h-full rounded flex flex-col `} ref={editorContainerRef}>
                <PanelGroup direction="vertical">
                  {/* Top: Code Editor */}
                  <Panel defaultSize={65} minSize={20}>
                    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
                      <div className={`flex items-center justify-between px-4 py-2 ${themeClasses.panelBg} border-b ${themeClasses.border}`}>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-red-500"></span>
                            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                            <span className="h-3 w-3 rounded-full bg-green-500"></span>
                          </div>
                          <div className={`ml-4 text-sm font-medium ${themeClasses.textSecondary}`}>{langMap[selectedLanguage]} Snippet</div>
                        </div>
                        <div className="flex items-center gap-3 relative">
                          <button onClick={handleCopyCode} title="Copy Code" className={`${themeClasses.textSecondary} hover:${themeClasses.textActive}`}><Copy size={16} /></button>
                          <button onClick={handleFullscreen} title="Toggle Fullscreen (F11)" className={`${themeClasses.textSecondary} hover:${themeClasses.textActive}`}><Expand size={16} /></button>
                          <div className="relative">
                            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} title="Settings" className={`${themeClasses.textSecondary} hover:${themeClasses.textActive}`}><Settings size={16} /></button>
                            {isSettingsOpen && (
                              <div className={`absolute top-full right-0 mt-2 w-48 p-3 rounded-md shadow-lg z-20 ${themeClasses.bg} border ${themeClasses.border}`}>
                                <label className="text-sm mb-2 block">Font Size</label>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs">{fontSize}px</span>
                                  <input type="range" min="10" max="24" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full h-1 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 w-full h-full">
                        <Editor
                          height="100%"
                          language={getLanguageForMonaco(selectedLanguage)}
                          value={code}
                          onChange={handleEditorChange}
                          onMount={handleEditorDidMount}
                          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                          options={{
                            fontSize, minimap: { enabled: false }, padding: {
                              top: 24,
                              bottom: 24
                            }, scrollBeyondLastLine: false, automaticLayout: true, wordWrap: 'on'
                          }}

                        />
                      </div>
                    </div>
                  </Panel>

                  <PanelResizeHandle className={`h-2 transition-colors ${themeClasses.resizeHandle}`} />

                  <Panel defaultSize={35} minSize={10}>
                    <div className={`h-full flex flex-col ${themeClasses.bg}`}>
                      <div className={`flex-shrink-0 flex items-center justify-between border-b ${themeClasses.border} px-4`}>
                        <div className="flex items-center">
                          {['testcases', 'result'].map(tab => (
                            <button key={tab} onClick={() => setActiveBottomTab(tab)} className={`py-2 px-4 text-sm font-medium transition-colors ${activeBottomTab === tab ? `${themeClasses.textActive} border-b-2 ${themeClasses.activeTabBorder}` : `${themeClasses.textSecondary} hover:${themeClasses.textActive}`}`}>
                              {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 py-1.5">
                          <select value={selectedLanguage} onChange={(e) => handleLanguageChange(e.target.value)} className={`text-sm rounded border px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 ${themeClasses.inputBg} ${themeClasses.border} ${themeClasses.text}`}>
                            {['javascript', 'java', 'cpp'].map((lang) => (<option key={lang} value={lang}>{langMap[lang]}</option>))}
                          </select>
                          <button onClick={handleRun} disabled={loading} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded disabled:opacity-50 transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}>
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />} Run
                          </button>
                          <button onClick={handleSubmitCode} disabled={loading} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-50 transition-colors">
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} Submit
                          </button>
                        </div>
                      </div>
                 
                      <div className="flex-1 overflow-y-auto p-4 text-sm">
                        {activeBottomTab === 'testcases' && (
                          <div>
                            {loading && !runResult && <div className="flex items-center"><Loader2 className="animate-spin mr-2" /><span>Running testcases...</span></div>}

                            {runResult && runResult.testCases && runResult.testCases.length > 0 ? (
                              runResult.testCases.map((tc, index) => {
                                const isPassed = tc.status_id === 3; 
                                return (
                                  <div key={`run-${index}`} className={`rounded-md border ${isPassed ? 'border-green-500/30' : 'border-red-500/30'} ${themeClasses.panelBg} mb-3 overflow-hidden`}>
                     
                                    <div className="w-full flex justify-between items-center p-3 text-left">
                                      <div className="flex items-center gap-3">
                                        <span className={`font-semibold ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
                                          {isPassed ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                        </span>
                                        <span className={`${themeClasses.textActive}`}>Case #{index + 1}</span>
                                      </div>
                                      <span className={`font-bold text-sm ${isPassed ? 'text-green-400' : 'text-red-400'}`}>{isPassed ? 'Passed' : 'Failed'}</span>
                                    </div>

                                    {/* Always Visible Details */}
                                    <div className={`px-4 pb-3 border-t ${themeClasses.border} pt-3 font-mono text-xs`}>
                                      <div className="mb-2">
                                        <label className={`font-semibold ${themeClasses.textSecondary}`}>Input:</label>
                                        <pre className={`p-2 mt-1 rounded ${theme === 'dark' ? 'bg-black/50' : 'bg-gray-200'}`}>{tc.stdin}</pre>
                                      </div>
                                      <div className="mb-2">
                                        <label className={`font-semibold ${themeClasses.textSecondary}`}>Your Output:</label>
                                        <pre className={`p-2 mt-1 rounded ${theme === 'dark' ? 'bg-black/50' : 'bg-gray-200'}`}>{tc.stdout || 'N/A'}</pre>
                                      </div>
                                      <div className="mb-2">
                                        <label className={`font-semibold ${themeClasses.textSecondary}`}>Expected Output:</label>
                                        <pre className={`p-2 mt-1 rounded ${theme === 'dark' ? 'bg-black/50' : 'bg-gray-200'}`}>{tc.expected_output}</pre>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : runResult ? (
                              <div className={`p-3 rounded-md ${runResult.success ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
                                {runResult.error || "No test cases were returned."}
                              </div>
                            ) : (
                              !loading && <div className={`${themeClasses.textSecondary}`}>Click "Run" to test your code with the example test cases.</div>
                            )}
                          </div>
                        )}

                        {activeBottomTab === 'result' && (
                          <div>
                            {loading && !submitResult && <div className="flex items-center"><Loader2 className="animate-spin mr-2" /><span>Submitting for evaluation...</span></div>}

                            {submitResult ? (
                              <div>
                                <div className={`p-4 rounded-md mb-4 ${submitResult.accepted ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
                                  <h4 className={`font-bold text-lg ${submitResult.accepted ? 'text-green-200' : 'text-red-200'}`}>
                                    {submitResult.accepted ? '🎉 Accepted' : `❌ ${submitResult?.status?.description || submitResult?.error || 'Failed'} `}
                                  </h4>
                                  <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                                </div>

                                {submitResult.testCases && submitResult.testCases.length > 0 && submitResult.testCases.map((tc, index) => {
                                  const isPassed = tc.status_id === 3;
                                  return (
                                    <div key={`submit-${index}`} className={`rounded-md border ${isPassed ? 'border-green-500/30' : 'border-red-500/30'} ${themeClasses.panelBg} mb-3 overflow-hidden`}>
                                 
                                      <div className="w-full flex justify-between items-center p-3 text-left">
                                        <div className="flex items-center gap-3">
                                          <span className={`font-semibold ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
                                            {isPassed ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                          </span>
                                          <span className={`${themeClasses.textActive}`}>Case #{index + 1}</span>
                                        </div>
                                        <span className={`font-bold text-sm ${isPassed ? 'text-green-400' : 'text-red-400'}`}>{isPassed ? 'Passed' : 'Failed'}</span>
                                      </div>

                     
                                      <div className={`px-4 pb-3 border-t ${themeClasses.border} pt-3 font-mono text-md`}>
                                        <div className="mb-2">
                                          <label className={`font-semibold ${themeClasses.textSecondary}`}>Input:</label>
                                          <pre className={`p-2 mt-1 rounded ${theme === 'dark' ? 'bg-black/50' : 'bg-gray-200'}`}>{tc.stdin}</pre>
                                        </div>
                                        <div className="mb-2">
                                          <label className={`font-semibold ${themeClasses.textSecondary}`}>Your Output:</label>
                                          <pre className={`p-2 mt-1 rounded ${theme === 'dark' ? 'bg-black/50' : 'bg-gray-200'}`}>{tc.stdout || 'N/A'}</pre>
                                        </div>
                                        <div className="mb-2">
                                          <label className={`font-semibold ${themeClasses.textSecondary}`}>Expected Output:</label>
                                          <pre className={`p-2 mt-1 rounded ${theme === 'dark' ? 'bg-black/50' : 'bg-gray-200'}`}>{tc.expected_output}</pre>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                                }
                              </div>
                            ) : (
                              !loading && <div className={`${themeClasses.textSecondary}`}>Click "Submit" to evaluate your solution against all test cases.</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Panel>
                </PanelGroup>
              </div>
            </Panel>
          </PanelGroup>
        </main>

        <button
          onClick={() => setIsChatOpen(true)}
          title="AI Assistant"
          className=" sticky bottom-8 left-[90rem] z-50 h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        >
          <Bot size={28} />
        </button>


        {isChatOpen && (
          <ChatAi
            problem={problem}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div >
    </>
  );
};

export default ProblemPage;
