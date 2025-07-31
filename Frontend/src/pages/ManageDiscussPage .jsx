
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router'; 
import { Toaster, toast } from 'react-hot-toast';

import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosClient from '../utils/axiosClient'; 

import {
    Edit,
    Trash2,
    MessageSquare,
    Heart,
    Loader2,
    ServerCrash,
    FileEdit,
    X,
    ArrowBigLeftDashIcon
} from 'lucide-react';

const EditDiscussionModal = ({ post, isOpen, onClose, onPostUpdated, themeClasses }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setTags(post.tags.join(', '));
        }
    }, [post]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const updatedData = { 
                title, 
                content, 
                tags: tags.split(',').map(tag => tag.trim()).filter(Boolean) 
            };
            const response = await axiosClient.put(`/discuss/${post._id}`, updatedData);
            toast.success('Post updated successfully!');
            onPostUpdated(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className={`w-full max-w-2xl rounded-2xl border p-6 sm:p-8 relative ${themeClasses.bg} ${themeClasses.border}`} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500/20"><X size={24} /></button>
                <h2 className="text-2xl font-bold mb-6">Edit Discussion</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full p-3 rounded-lg border ${themeClasses.border} ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 outline-none`} />
                    <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} rows={6} className={`w-full p-3 rounded-lg border ${themeClasses.border} ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 outline-none resize-none`} />
                    <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} className={`w-full p-3 rounded-lg border ${themeClasses.border} ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 outline-none`} />
                    <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 mt-2 px-6 py-3 font-bold rounded-lg transition-colors bg-primary text-white hover:bg-primary/90 disabled:bg-gray-500">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};


function ManageDiscussPage() {
    const { theme } = useSelector((state) => state.auth);
    const [myPosts, setMyPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const themeClasses = {
        bg: theme === 'dark' ? 'bg-black' : 'bg-white',
        textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
        border: theme === 'dark' ? 'border-gray-200/20' : 'border-gray-200',
        inputBg: theme === 'dark' ? 'bg-gray-100/4' : 'bg-gray-100',
        skeletonBg: theme === 'dark' ? 'bg-gray-100/5' : 'bg-gray-200',
    };

    const fetchMyPosts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosClient.get('/discuss/my-posts');
            setMyPosts(response.data);
        } catch (err) {
            setError('Failed to load your posts. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyPosts();
    }, [fetchMyPosts]);
    
    const handlePostUpdated = (updatedPost) => {
        setMyPosts(prevPosts => 
            prevPosts.map(post => (post._id === updatedPost._id ? updatedPost : post))
        );
        setEditingPost(null);
    };
    
    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await axiosClient.delete(`/discuss/${deletingId}`);
            toast.success('Post deleted successfully!');
            setMyPosts(prevPosts => prevPosts.filter(post => post._id !== deletingId));
            setDeletingId(null);
        } catch (error) {
            toast.error('Failed to delete post.');
            setDeletingId(null);
        }
    };

    return (
        <div className={`${themeClasses.bg} ${themeClasses.textPrimary} min-h-screen`}>
            <Toaster position="top-center" />
            <Header />

            <main className="container mx-auto px-4 py-16 sm:py-20">
                <div className="flex flex-col sm:flex-col items-center justify-between gap-4 mb-12">
                     <div className="text-center sm:text-left">
                        <h1 className="text-4xl sm:text-5xl font-extrabold flex items-center flex-col justify-center sm:justify-start gap-3">
                           <FileEdit className="h-10 w-10 text-blue-400" /> Manage Posts
                        </h1>
                        <p className={`mt-2 text-lg ${themeClasses.textSecondary}`}>
                            Here you can edit or delete your contributions to the community.
                        </p>
                    </div>
                     <NavLink to="/discuss" className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 btn btn-md btn-outline font-bold rounded-lg transition-colors   ">
                      <ArrowBigLeftDashIcon size={24}/>   Back to Discussions
                     </NavLink>
                </div>
                

                <div className="max-w-4xl mx-auto space-y-4">
                    {isLoading && [...Array(3)].map((_, i) => (
                        <div key={i} className={`p-5 rounded-2xl h-28 ${themeClasses.skeletonBg} animate-pulse`} />
                    ))}

                    {error && (
                         <div className={`text-center p-10 border-2 border-dashed rounded-xl ${themeClasses.border}`}>
                            <ServerCrash className="mx-auto h-12 w-12 text-red-500" />
                            <h3 className="mt-4 text-xl font-semibold text-red-500">Oops! An error occurred.</h3>
                            <p className={themeClasses.textSecondary}>{error}</p>
                            <button onClick={fetchMyPosts} className="mt-6 px-5 py-2.5 font-bold rounded-lg bg-primary text-white">Retry</button>
                        </div>
                    )}
                    
                    {!isLoading && !error && myPosts.map(post => (
                        <div key={post._id} className={`p-5 rounded-2xl border ${themeClasses.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
                            <div>
                                <h3 className="text-xl font-bold">{post.title}</h3>
                                <div className="flex items-center gap-5 text-sm mt-2 text-gray-500">
                                    <div className="flex items-center gap-1.5"><Heart size={16} /><span>{post.upvotes?.length || 0}</span></div>
                                    <div className="flex items-center gap-1.5"><MessageSquare size={16} /><span>{post.comments?.length || 0}</span></div>
                                </div>
                            </div>
                            <div className="flex gap-3 flex-shrink-0">
                                <button onClick={() => setEditingPost(post)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"><Edit size={16} /> Edit</button>
                                <button onClick={() => setDeletingId(post._id)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 size={16} /> Delete</button>
                            </div>
                        </div>
                    ))}

                     {!isLoading && !error && myPosts.length === 0 && (
                         <div className={`text-center p-10 border-2 border-dashed rounded-xl ${themeClasses.border}`}>
                            <MessageSquare className="mx-auto h-12 w-12 text-gray-500" />
                            <h3 className="mt-4 text-xl font-semibold">You haven't posted anything yet.</h3>
                            <p className={themeClasses.textSecondary}>Start a discussion to share your ideas with the community!</p>
                        </div>
                    )}
                </div>
            </main>

            <EditDiscussionModal 
                post={editingPost}
                isOpen={!!editingPost} 
                onClose={() => setEditingPost(null)}
                onPostUpdated={handlePostUpdated} 
                themeClasses={themeClasses} 
            />

            {deletingId && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className={`w-full max-w-md rounded-2xl p-6 text-center ${themeClasses.bg} border ${themeClasses.border}`}>
                        <Trash2 className="mx-auto h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
                        <p className={themeClasses.textSecondary}>This action cannot be undone. Your post will be permanently deleted.</p>
                        <div className="flex gap-4 mt-6">
                            <button onClick={() => setDeletingId(null)} className="w-full py-2.5 rounded-lg font-semibold bg-gray-500/20 hover:bg-gray-500/30">Cancel</button>
                            <button onClick={handleDelete} className="w-full py-2.5 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600">Delete Post</button>
                        </div>
                    </div>
                </div>
            )}
            
            <Footer />
        </div>
    );
}

export default ManageDiscussPage;