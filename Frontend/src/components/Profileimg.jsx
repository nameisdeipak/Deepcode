import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, RotateCcw, RotateCw, ZoomIn, ZoomOut, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../authSlice";
import { toast } from 'react-hot-toast';

const profileImgSchema = z.object({
  image: z.instanceof(FileList)
    .refine(files => files?.length === 1, 'Image is required')
    .refine(files => files[0]?.size <= 5 * 1024 * 1024, 'Max file size is 5MB')
    .refine(files => ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type)),
});

function ProfileImage({ editiProfile, setEditProfile }) {
  const { user, theme } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset
  } = useForm({
    resolver: zodResolver(profileImgSchema)
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const imageRef = useRef(null);
  const imagePreview = watch('image')?.[0] ? URL.createObjectURL(watch('image')[0]) : `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`;



  const onSubmit = async (data) => {
    if (!data.image) return;

    const formData = new FormData();
    formData.append('image', data.image[0]);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await axios.post('/user/Profile/avatar/uploadImage', formData, {
        baseURL:  import.meta.env.VITE_BACKEND_URL,
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });


      dispatch(updateUser(response?.data?.user));

      reset();
      // resetImage();
      setIsUploading(false);
      toast.success('Profile image updated successfully!');
      setEditProfile(false);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      toast.error('Failed to update profile image');
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);


      const themeClasses = {
        bg: theme === 'dark' ? 'bg-black' : 'bg-white',
        sectionBg: theme === 'dark' ? 'bg-black' : 'bg-slate-50',
        textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
        accent: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        border: theme === 'dark' ? 'border-gray-200/20' : 'border-white',
    }

  return (
    <div className={`${editiProfile ? 'flex' : 'hidden'} justify-center items-center w-full min-h-screen  bg-black/80 absolute rounded-xl p-4 z-10`}>
      <div className={`max-auto flex flex-col w-96 max-w-3xl h-auto  shadow rounded-xl p-4 relative border  ${themeClasses.bg}  ${themeClasses.border}`}>
        <button className={`btn-soft text-black absolute top-5 right-5  ${themeClasses.textPrimary}`} onClick={() => setEditProfile(false)}>
          <X size={30} />
        </button>

        <div className={` text-xl font-medium px-2 py-4 text-black  ${themeClasses.textSecondary}`}>Upload a New Avatar</div>

        <div className={`w-full border  bg-black ${themeClasses.border} h-auto flex justify-center items-center flex-col gap-4 p-4 rounded-lg mb-4 `}>
          <div className="avatar w-50 relative">
            <div className="w-50 rounded-full ring-0 ring-primary  ring-offset-2 overflow-hidden">
              {imagePreview ? (
                <img
                  ref={imageRef}
                  alt="Preview"
                  src={imagePreview}
          
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  alt="Profile"
                  src={`${user?.profile?.profile_url}?${Date.now()}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>


        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-1 mb-4">
            <label className="flex flex-col items-center justify-center w-full h-full p-6 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:bg-base-300 transition-colors">
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

          {isUploading && (
            <div className="mb-4">
              <progress className="progress progress-primary w-full" value={uploadProgress} max="100"></progress>
              <p className="text-sm text-center mt-1">Uploading: {uploadProgress}%</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                reset();
                // resetImage();
              }}
              className="btn btn-ghost shadow"
              disabled={!imagePreview || isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`  btn btn-primary`}
              disabled={!imagePreview || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileImage;
