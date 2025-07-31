import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';
import { NavLink } from 'react-router';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosClient from '../utils/axiosClient';
import { Lightbulb, Plus, MessageCircle, ArrowBigUp, ArrowBigDown, X, Loader2, ServerCrash, Send } from 'lucide-react';

const DiscussionCardSkeleton = ({ themeClasses }) => (
  <div className={`flex animate-pulse items-start gap-4 p-5 rounded-xl border ${themeClasses.border}`}>
    <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-1">
      <div className={`h-6 w-6 rounded ${themeClasses.skeletonBg}`} />
      <div className={`h-5 w-8 rounded ${themeClasses.skeletonBg}`} />
      <div className={`h-6 w-6 rounded ${themeClasses.skeletonBg}`} />
    </div>
    <div className="w-full">
      <div className={`h-4 w-1/3 rounded ${themeClasses.skeletonBg} mb-3`} />
      <div className={`h-6 w-4/5 rounded ${themeClasses.skeletonBg} mb-3`} />
      <div className="flex flex-wrap gap-2 mb-4">
        <div className={`h-5 w-16 rounded-full ${themeClasses.skeletonBg}`} />
        <div className={`h-5 w-20 rounded-full ${themeClasses.skeletonBg}`} />
      </div>
      <div className={`h-4 w-1/4 rounded ${themeClasses.skeletonBg}`} />
    </div>
  </div>
);

const ExpandedContentView = ({ discussion, themeClasses, onUpdate }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useSelector((state) => state.auth);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await axiosClient.post(`/discuss/${discussion._id}/comment`, { text: newComment });
      onUpdate(response.data);
      setNewComment('');
      toast.success('Comment posted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200/50">
      <div className={`prose ${theme === 'dark' ? 'prose-invert' : ''} max-w-none mb-6 text-base ${themeClasses.textSecondary}`}>
        <p>{discussion.content}</p>
      </div>

      <h4 className={`font-bold text-lg mb-4 ${themeClasses.textPrimary}`}>Comments ({discussion.comments?.length || 0})</h4>

      <form onSubmit={handleCommentSubmit} className="flex items-start gap-3 mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment..."
          rows={1}
          className={`w-full p-3 rounded-lg border ${themeClasses.border} ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 outline-none resize-y transition-colors`}
        />
        <button type="submit" disabled={isSubmitting || !newComment.trim()} className="p-3 rounded-lg bg-primary text-white disabled:bg-gray-500 disabled:cursor-not-allowed flex-shrink-0 transition-colors">
          {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : <Send className="h-6 w-6" />}
        </button>
      </form>

      <div className="space-y-4">
        {(discussion.comments || []).slice().reverse().map(comment => {
          const authorUsername = comment?.author?.username || " Anonymous";
          const authorAvatar = comment?.author?.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${authorUsername}`;

          return (
            <div key={comment._id} className="flex items-start gap-3">
              <img
                src={authorAvatar}
                alt={authorUsername}
                className={`h-9 w-9 rounded-full object-cover flex-shrink-0 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              />
              <div className={`w-full rounded-lg p-3 ${themeClasses.inputBg}`}>
                <p className="font-bold text-sm text-blue-400">{authorUsername}</p>
                <p className={`text-base ${themeClasses.textPrimary} break-words`}>{comment.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const DiscussionCard = ({ discussion, themeClasses, user, isExpanded, onExpand, onUpdate }) => {
  const voteCount = (discussion.upvotes?.length || 0) - (discussion.downvotes?.length || 0);
  const userUpvoted = user && discussion.upvotes?.includes(user._id);
  const userDownvoted = user && discussion.downvotes?.includes(user._id);

  const handleVote = async (voteType) => {
    try {
      const response = await axiosClient.put(`/discuss/${discussion._id}/vote`, { voteType });
      onUpdate(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't process vote. Please log in.");
    }
  };

  return (
    <div className={`p-4 sm:p-5 rounded-xl border transition-all duration-300 ${isExpanded ? 'border-blue-500 shadow-lg' : themeClasses.border} ${themeClasses.bg}`}>
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
          <button onClick={(e) => { e.stopPropagation(); handleVote('upvote'); }} aria-label="Upvote" className={`p-1 rounded-md transition-colors hover:bg-green-500/10 ${userUpvoted ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}>
            <ArrowBigUp />
          </button>
          <span className={`text-lg font-bold ${themeClasses.textPrimary}`}>{voteCount}</span>
          <button onClick={(e) => { e.stopPropagation(); handleVote('downvote'); }} aria-label="Downvote" className={`p-1 rounded-md transition-colors hover:bg-red-500/10 ${userDownvoted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
            <ArrowBigDown />
          </button>
        </div>
        <div className="w-full cursor-pointer" onClick={onExpand}>
          <p className={`text-xs ${themeClasses.textSecondary} mb-1.5`}>
            Posted by <span className="font-semibold text-blue-400">{discussion.author?.username || 'User'}</span>
            {' · '}
            {new Date(discussion.createdAt).toLocaleDateString()}
          </p>
          <h3 className={`text-lg sm:text-xl font-bold ${themeClasses.textPrimary} mb-2 break-words`}>{discussion.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <MessageCircle size={16} /><span>{discussion.comments?.length || 0} Comments</span>
          </div>
        </div>
      </div>
      {isExpanded && (
        <ExpandedContentView
          discussion={discussion}
          themeClasses={themeClasses}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};


const CreateDiscussionModal = ({ isOpen, onClose, onPostCreated, themeClasses }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    try {
      const postData = { title, content, tags: tags.split(',').map(tag => tag.trim()).filter(Boolean) };
      const response = await axiosClient.post('/discuss/createDiscuss', postData);
      toast.success('Discussion created successfully!');
      onPostCreated(response.data);
      onClose();
      setTitle(''); setContent(''); setTags('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full max-w-2xl rounded-2xl border p-6 sm:p-8 relative flex flex-col ${themeClasses.bg} ${themeClasses.border}`} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500/20"><X size={24} /></button>
        <h2 className={`text-2xl font-bold mb-6 ${themeClasses.textPrimary}`}>Start a New Discussion</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full p-3 rounded-lg border ${themeClasses.border} ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 outline-none`} />
          <textarea placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} rows={6} className={`w-full p-3 rounded-lg border ${themeClasses.border} ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 outline-none resize-none`} />
          <input type="text" placeholder="Tags (comma-separated, e.g., javascript, react)" value={tags} onChange={(e) => setTags(e.target.value)} className={`w-full p-3 rounded-lg border ${themeClasses.border} ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 outline-none`} />
          <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 mt-2 px-6 py-3 font-bold rounded-lg transition-colors bg-primary text-white hover:bg-primary/90 disabled:bg-gray-500">{isSubmitting ? <Loader2 className="animate-spin" /> : 'Post Discussion'}</button>
        </form>
      </div>
    </div>
  );
};


function Discuss() {
  const { theme, user } = useSelector((state) => state.auth);
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const themeClasses = {
    bg: theme === 'dark' ? 'bg-black' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    border: theme === 'dark' ? 'border-gray-200/20' : 'border-gray-200',
    inputBg: theme === 'dark' ? 'bg-gray-200/4' : 'bg-gray-100',
    skeletonBg: theme === 'dark' ? 'bg-gray-200/30' : 'bg-gray-200',
    tagBg: theme === 'dark' ? 'bg-blue-200/20 text-blue-300' : 'bg-blue-100 text-gray-200',
  };

  const fetchDiscussions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosClient.get('/discuss/getAllDiscuss');
      setDiscussions(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError('Failed to load discussions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  const handleDiscussionUpdate = useCallback((updatedDiscussion) => {
    setDiscussions(currentDiscussions =>
      currentDiscussions.map(d =>
        d._id === updatedDiscussion._id ? updatedDiscussion : d
      )
    );
  }, []);

  const handlePostCreated = (newPost) => {
    setDiscussions(prev => [newPost, ...prev]);
    setExpandedId(newPost._id);
  };

  const toggleExpansion = (id) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className={`${themeClasses.bg} min-h-screen ${themeClasses.textPrimary}`}>
        <Header />
        <main className="container mx-auto px-4 py-16 sm:py-20">
          <div className="flex flex-col items-center justify-between gap-4 mb-12">
            <div className="text-center max-w-2xl mx-auto">
              <Lightbulb className={`mx-auto h-12 w-12 mb-4 text-yellow-400`} strokeWidth={1.5} />
              <h1 className="text-4xl sm:text-5xl font-extrabold">Community Discussions</h1>
              <p className={`mt-4 text-lg ${themeClasses.textSecondary}`}>
                Loading discussions... please wait.
              </p>
            </div>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {[...Array(3)].map((_, i) => <DiscussionCardSkeleton key={i} themeClasses={themeClasses} />)}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`${themeClasses.bg} ${themeClasses.textPrimary}`}>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <main className="container mx-auto px-4 py-16 sm:py-20">
        <div className="flex flex-col  items-center justify-between gap-4 mb-12">
          <div className="text-center md:text-left max-w-2xl">
            <Lightbulb className={`mx-auto md:mx-0 h-12 w-12 mb-4 text-yellow-400`} strokeWidth={1.5} />
            <h1 className="text-4xl sm:text-5xl font-extrabold">Community Discussions</h1>
            <p className={`mt-4 text-lg ${themeClasses.textSecondary}`}>
              Ask questions, share ideas, and learn from a global community of developers.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <NavLink to="/manage-discuss" className="flex-shrink-0 flex items-center justify-center btn btn-md btn-soft btn-primary gap-2 px-6 py-3 font-bold rounded-lg transition-colors">
              Manage My Posts
            </NavLink>
            <button onClick={() => setIsModalOpen(true)} className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 btn btn-md btn-primary font-bold rounded-lg transition-colors">
              <Plus size={20} /> Start a Discussion
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto space-y-4">
          {error && (
            <div className={`text-center p-10 border-2 border-dashed rounded-xl ${themeClasses.border}`}>
              <ServerCrash className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-xl font-semibold text-red-500">Oops! Something went wrong.</h3>
              <p className={themeClasses.textSecondary}>{error}</p>
              <button onClick={fetchDiscussions} className="mt-6 px-5 py-2.5 font-bold rounded-lg bg-primary text-white">Retry</button>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {discussions.length > 0 ? (
                discussions.map(discussion => (
                  <DiscussionCard
                    key={discussion._id}
                    discussion={discussion}
                    themeClasses={themeClasses}
                    user={user}
                    isExpanded={expandedId === discussion._id}
                    onExpand={() => toggleExpansion(discussion._id)}
                    onUpdate={handleDiscussionUpdate}
                  />
                ))
              ) : (
                <div className={`text-center p-10 border-2 border-dashed rounded-xl ${themeClasses.border}`}>
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-500" />
                  <h3 className="mt-4 text-xl font-semibold">No discussions yet.</h3>
                  <p className={themeClasses.textSecondary}>Be the first one to start a conversation!</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <CreateDiscussionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
        themeClasses={themeClasses}
      />
      <Footer />
    </div>
  );
}

export default Discuss;