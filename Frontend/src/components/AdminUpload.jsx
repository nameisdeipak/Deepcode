


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import { useSelector } from "react-redux";
import { toast, Toaster } from 'react-hot-toast';


function AdminUpload({ problemId, onUploadSuccess, theme }) {


  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    
    setUploading(true);
    setUploadProgress(0);
    clearErrors();
    setUploadedVideo(null); 

    try {
    
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

   
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);


      const uploadResponse = await axios.post(upload_url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;


      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset(); 

      
      if (onUploadSuccess) {
        
        toast.success('Successfully Uploaded Video.');
        setTimeout(() => {
          onUploadSuccess();
        }, 1500);
      }
      
    } catch (err) {
       toast.error('Failed  to Upload Video.');
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message: err.response?.data?.message || 'Upload failed. Please try again.'
      });
      setUploading(false); 
    } 
    
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

     const isDark = theme === 'dark';
  const themeClasses = {
  selection : isDark ? 'bg-black border-gray-200/30 text-gray-300' : 'bg-white border-gray-200 text-black',
  input : isDark ? 'bg-gray-100/10 border-gray-200/30 text-gray-300' : 'bg-gray-300 border-gray-200 text-black',
    container: isDark ? 'bg-gray-100/5 border-gray-100/20' : 'bg-white border-gray-200',
    modalBox: isDark ? 'bg-black border border-gray-200/20 ' : 'bg-white text-black',
    tableHeader: isDark ? 'text-gray-200 bg-gray-200/10' : 'text-gray-600 bg-gray-50',
    tableRow: isDark ? 'hover:bg-gray-100/10 border-gray-700' : 'hover:bg-gray-50 border-gray-200',
    labelMuted: isDark ? 'text-gray-400' : 'text-gray-500',
  };

  return (
    <>
    
      <h2 className={`card-title mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Upload Video
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control max-w-2xl w-full">
          <label className="label">
            <span className="label-text">Choose video file (Max 100MB)</span>
          </label>
          <input
            type="file"
            accept="video/*"
            {...register('videoFile', {
              required: 'Please select a video file',
              validate: {
                isVideo: (files) => (files?.[0]?.type.startsWith('video/')) || 'Please select a valid video file',
                fileSize: (files) => (files?.[0]?.size <= 100 * 1024 * 1024) || 'File size must be less than 100MB',
              }
            })}
            className={`file-input  file-input-bordered w-full  ${themeClasses.input} ${errors.videoFile ? 'file-input-error' : ''}`}
            disabled={uploading}
          />
          {errors.videoFile && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.videoFile.message}</span>
            </label>
          )}
        </div>

        {selectedFile && !uploadedVideo && (
          <div className={` ${themeClasses.selection} px-4  py-2 border rounded  bg-transparent text-black `}>
            <div>
              <h3 className="font-medium ">Selected File:</h3>
              <p className="text-sm">{selectedFile.name}</p>
              <p className="text-sm">Size: {formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-2 max-w-80 mx-auto">
            <div className="flex justify-center items-center flex-col  text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <progress 
              className="progress progress-primary max-w-xl" 
              value={uploadProgress} 
              max="100"
            ></progress>
          </div>
        )}

        {errors.root && (
          <div className="alert alert-error">
            <span>{errors.root.message}</span>
          </div>
        )}

        {uploadedVideo && (
          <div className="border p-4  border-success">
            <div>
              <h3 className="font-medium">Upload Successful!</h3>
              <p className="text-sm">Duration: {formatDuration(uploadedVideo.duration)}</p>
              <p className="text-sm">This window will close shortly...</p>
            </div>
          </div>
        )}

        <div className="card-actions justify-center">
          <button
            type="submit"
            disabled={uploading || uploadedVideo}
            className={`btn btn-sm  btn-primary ${uploading ? 'loading text-neutral' : ''}`}
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </form>
    </>
  );
}

export default AdminUpload;