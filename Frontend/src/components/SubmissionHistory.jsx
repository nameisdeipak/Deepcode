

import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import { useSelector } from "react-redux";
import { Info, CheckCircle, XCircle, AlertTriangle, Clock, FileText, X } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';






const formatMemory = (memory) => {
    if (!memory) return 'N/A';
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const SubmissionHistory = ({ problemId }) => {
  const { theme } = useSelector((state) => state.auth);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);


  const themeClasses = {
    mainBg: theme === 'dark' ? 'bg-black' : 'bg-white',
    panelBg: theme === 'dark' ? 'bg-black border-gray-200/20 border' : 'bg-gray-50 border-gray-100',
    modalBg: theme === 'dark' ? 'bg-black' : 'bg-black',
    text: theme === 'dark' ? 'text-gray-200' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    hover: theme === 'dark' ? 'hover:bg-gray-800/60' : 'hover:bg-gray-50',
    button: theme === 'dark'
      ? 'border border-gray-700 text-gray-300 hover:bg-gray-800'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    spinner: theme === 'dark' ? 'border-gray-400' : 'border-gray-800',
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch submission history.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [problemId]);

  
  useEffect(() => {
    if (selectedSubmission) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedSubmission]);

  
  const StatusCell = ({ status }) => {
    const details = {
      accepted: { color: 'text-green-500', bgColor: 'bg-green-500/10' },
      wrong: { color: 'text-red-500', bgColor: 'bg-red-500/10' },
      error: { color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
      pending: { color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
    }[status] || { color: 'text-gray-500', bgColor: 'bg-gray-500/10' };
    
    const Icon = { accepted: CheckCircle, wrong: XCircle, error: AlertTriangle, pending: Clock }[status] || AlertTriangle;

    return (
      <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${details.color} ${details.bgColor}`}>
        <Icon size={15} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${themeClasses.spinner}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 my-4 rounded-lg flex items-center gap-3 ${theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'}`}>
        <XCircle />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 rounded-lg transition-colors duration-300 border ${themeClasses.panelBg} ${themeClasses.text}`}>
      {submissions.length === 0 ? (
        <div className='flex flex-col gap-4 justify-center items-center py-16'>
          <Info size={48} className={themeClasses.textSecondary} />
          <h3 className={`text-lg font-semibold ${themeClasses.textSecondary}`}>No Submissions Yet</h3>
          <p className={themeClasses.textSecondary}>Submit a solution to see your history here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className={`border-b ${themeClasses.border} ${themeClasses.textSecondary}`}>
              <tr>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Language</th>
                <th className="p-4 font-semibold">Runtime</th>
                <th className="p-4 font-semibold">Memory</th>
                <th className="p-4 font-semibold">Submitted</th>
                <th className="p-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub._id} className={`border-b transition-colors duration-200 ${themeClasses.border} ${themeClasses.hover}`}>
                  <td className="p-4"><StatusCell status={sub.status} /></td>
                  <td className="p-4 font-mono">{sub.language}</td>
                  <td className="p-4 font-mono">{sub.runtime}s</td>
                  <td className="p-4 font-mono">{formatMemory(sub.memory)}</td>
                  <td className="p-4">{formatDate(sub.createdAt)}</td>
                  <td className="p-4 text-right">
                    <button
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-semibold transition-all duration-200 ${themeClasses.button}`}
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      <FileText size={14} />
                      View Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedSubmission && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className={`relative w-11/12 max-w-4xl rounded-lg shadow-2xl transition-all duration-300 ${themeClasses.modalBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`rounded-lg overflow-hidden border ${themeClasses.border}`}>
              <div className="flex items-center h-10 px-4 bg-black/50">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className={`flex-1 text-center text-sm ${themeClasses.textSecondary} font-mono`}>
                  {selectedSubmission.language} Submission
                </div>
                <button onClick={() => setSelectedSubmission(null)} className={`${themeClasses.textSecondary} hover:text-white transition-colors`}>
                  <X size={20} />
                </button>
              </div>

              <div className={`p-4 border-b ${themeClasses.border} ${theme === 'dark' ? 'bg-gray-900/40' : 'bg-gray-50'}`}>
                {/* Details bar content... */}
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                 <SyntaxHighlighter
                    language={selectedSubmission.language.toLowerCase()}
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '16px', background: '#1e1e1e' }}
                    showLineNumbers={true}
                  >
                    {selectedSubmission.code}
                  </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
