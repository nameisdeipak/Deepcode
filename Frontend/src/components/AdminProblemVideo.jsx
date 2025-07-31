

import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axiosClient from '../utils/axiosClient';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import ReactPlayer from 'react-player/lazy';
import AdminUpload from './AdminUpload';
import { X, TriangleAlert } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';


const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AdminProblemVideo = () => {
  const { theme } = useSelector(state => state.auth);
  const [allProblems, setAllProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [vidoeToDelete, setVideoToDelete] = useState(null); 

  useEffect(() => {
    fetchProblemsAndVideos();
  }, []);

  const fetchProblemsAndVideos = async () => {
    try {
      const { data } = await axiosClient.get('/video/getAllProblemsVideos');
      const problemsWithVideos = data.videosWithProblems.map(videoInfo => ({ ...videoInfo.problemId, hasVideo: true, videoDetails: { _id: videoInfo._id, secureUrl: videoInfo.secureUrl, thumbnailUrl: videoInfo.thumbnailUrl } }));
      const problemsWithout = data.problemsWithoutVideos.map(problemInfo => ({ ...problemInfo, hasVideo: false, videoDetails: null }));
      setAllProblems([...problemsWithVideos, ...problemsWithout]);
    } catch (err) {
      toast.error("Failed to fetch problem and video data ");
      setError('Failed to fetch problem and video data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openVideoModal = (videoUrl) => {
    console.log("Opening video with URL:", videoUrl);
    if (videoUrl) {
      setCurrentVideoUrl(videoUrl);
      setIsVideoModalOpen(true);
      setIsVideoLoading(true);
    } else {
      console.error("Attempted to open video with an invalid URL.");
    }
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl('');
  };

  const openUploadModal = (problemId) => {
    setSelectedProblemId(problemId);
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedProblemId(null);
  };

  const handleUploadSuccess = () => {
    closeUploadModal();
    fetchProblemsAndVideos();
  };



  const handleOpenModal = (problem) => {
    setVideoToDelete(problem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isDeleting) return; 
    setIsModalOpen(false);
    setVideoToDelete(null);
  };


  const handleConfirmDelete = async () => {
    if (!vidoeToDelete) return;

    setIsDeleting(true);
    try {
      await axiosClient.delete(`/video/delete/${vidoeToDelete}`);
      fetchProblemsAndVideos();
      handleCloseModal(); 
      toast.success('Successfully Delete Video.');
      setVideoToDelete(null);
    } catch (err) {
      toast.error('Failed to delete the video.');
      
    } finally {
      setIsDeleting(false);
    }
  };


  const isDark = theme === 'dark';
  const themeClasses = {
    page: isDark ? 'bg-black text-gray-300' : 'bg-white text-black',
    container: isDark ? 'bg-gray-100/5 border-gray-100/20' : 'bg-white border-gray-200',
    modalBox: isDark ? 'bg-black border border-gray-200/20 ' : 'bg-white text-black',
    tableHeader: isDark ? 'text-gray-200 bg-gray-200/10' : 'text-gray-600 bg-gray-50',
    tableRow: isDark ? 'hover:bg-gray-100/10 border-gray-700' : 'hover:bg-gray-50 border-gray-200',
    labelMuted: isDark ? 'text-gray-400' : 'text-gray-500',
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


       <div className="hidden md:grid md:grid-cols-12 gap-4 px-12 p-6 font-medium text-xs uppercase">
                  <div className="col-span-1 animate-pulse bg-gray-300/50"></div>
                  <div className="col-span-4 animate-pulse bg-gray-300/50"></div>
                  <div className="col-span-2 p-4 animate-pulse bg-gray-300/50"></div>
                  <div className="col-span-2 p-4 animate-pulse bg-gray-300/50"></div>
                  <div className="col-span-3 text-center p-4 animate-pulse bg-gray-300/50"> </div>
                </div>
      
      <div  className={`py-11 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>   </div>
      <div  className={`py-11 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>   </div>
      <div  className={`py-11 px-7 animate-pulse mb-3 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border-0  transition-all ${theme === 'dark' ? 'bg-gray-300/20' : 'bg-gray-300/50'}`}>   </div>

          </div>

        </div>

      </div>
    </div>
    // <span className="loading loading-spinner loading-lg"></span></div>)
  )
 
  return (
    <> <Toaster position="top-center" reverseOrder={false} />
      <div className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} min-h-screen`}>
        <AdminHeader openTab={`Problem's Video's`} />
        <div className='flex'>
          <AdminSidebar />
          <main className="flex-grow p-2 sm:p-4 md:p-6 lg:p-8">
            <div className="container max-w-5xl mx-auto">
              <header className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">Manage Problem Videos</h1>
              </header>

              <div className="space-y-4">
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 font-medium text-xs uppercase border-b border-gray-200">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Title</div>
                  <div className="col-span-2">Difficulty</div>
                  <div className="col-span-2">Tags</div>
                  <div className="col-span-3 text-center">Video Action</div>
                </div>

                {allProblems.map((problem, index) => (
                  <div key={problem._id} className={`p-4 rounded-lg flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center border hover:bg-gray-300/30 transition-all ${theme === 'dark' ? 'bg-gray-100/5' : 'glass'}`}>
                    <div className="col-span-1"><span className="font-semibold">{index + 1}</span></div>
                    <div className="col-span-4"><span>{problem.title}</span></div>
                    {problem.difficulty &&<div className="col-span-2"><span className={`${problem?.difficulty.toLowerCase() === 'easy' ? 'text-success' : problem?.difficulty.toLowerCase() === 'medium' ? 'text-warning' : 'text-error'}`}>{problem?.difficulty}</span></div>}
                    <div className="col-span-2"><span className="badge-outline">{problem.tags}</span></div>
                    <div className="col-span-3 pt-3 md:pt-0">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        {problem.hasVideo ? (
                          <>
                            <button onClick={() => openVideoModal(problem?.videoDetails?.secureUrl)} className="relative group transition-transform duration-200 hover:scale-105" aria-label={`Play video for ${problem.title}`}>
                              <img src={problem?.videoDetails?.thumbnailUrl} alt={`Thumbnail for ${problem.title}`} className='w-36 h-20 object-cover rounded-md shadow-lg border-2 border-gray-300 ' />
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg></div>
                            </button>
                         
                            <button onClick={() => handleOpenModal(problem._id)} className="btn btn-sm btn-outline btn-error w-full sm:w-auto" aria-label={`Delete video for ${problem.title}`}>Delete</button>
                          </>
                        ) : (
                          <button onClick={() => openUploadModal(problem._id)} className="btn btn-primary w-full sm:w-auto">Upload Video</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>




        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-80 p-4 transition-opacity duration-300" onClick={closeVideoModal}>
            <div className="relative w-full max-w-3xl rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
              <button onClick={closeVideoModal} className="btn-sm absolute top-2 right-2 z-20 cursor-pointer text-gray-300 hover:text-white" aria-label="Close video player">
                <X size={30} />
              </button>
              <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-white"></span>
                  </div>
                )}
                <ReactPlayer
                  className="absolute top-0 left-0"
                  url={currentVideoUrl}
                  width="100%"
                  height="100%"
                  controls={true}
                  playing={true}
                  onReady={() => setIsVideoLoading(false)}
                  onError={(e) => {
                    console.error('ReactPlayer Error:', e);
                    setIsVideoLoading(false);
                    setError("Video could not be played.");
                  }}
                  config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                />
              </div>
            </div>
          </div>
        )}

        {isUploadModalOpen && (
          <div className="modal modal-open" onClick={closeUploadModal}>
            <div className={`modal-box w-11/12 max-w-lg relative ${theme === 'dark' ? 'bg-black border border-gray-200/20 text-white' : 'bg-gray-200 shadow  '}`} onClick={e => e.stopPropagation()}>
              <button onClick={closeUploadModal} className=" cursor-pointer  absolute right-2 top-2 z-10" aria-label="Close upload form"><X size={35} /></button>
              <AdminUpload problemId={selectedProblemId} onUploadSuccess={handleUploadSuccess} theme={theme} />
            </div>
          </div>
        )}
      </div>




      <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className={`modal-box flex-col flex justify-center items-center ${themeClasses.modalBox}`}>
          <div className="flex justify-center flex-col items-center gap-4">
            <TriangleAlert size={50} color='red' />
            <div className='text-center'>
              <h2 className="font-bold text-2xl">Confirm Deletion</h2>
              <p className="py-4">
                Are you sure you want to delete the Video  of Probelm " This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="modal-action flex justify-center items-center gap-4">
            <button onClick={handleCloseModal} className="btn btn-ghos btn-sm btn-outlinet" disabled={isDeleting}>Cancel</button>
            <button onClick={handleConfirmDelete} className="btn btn-sm btn-error " disabled={isDeleting}>
              {isDeleting ? <span className="loading loading-spinner text-gray-300"></span> : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProblemVideo;

