

import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { Send, Bot, User, X, Loader2 } from 'lucide-react';
import { addMessage, appendToLastMessage, clearChat } from "../aiChatSlice"; 
const backendUrl = import.meta.env.VITE_BACKEND_URL;




function ChatAi({ problem, onClose }) {
  const { theme } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const messagesFromRedux = useSelector((state) => state.aichat.chat);

  const initialGreetingMessage = { 
    role: 'model', 
    parts: [{ text: "Hello! I'm your AI assistant. How can I help you with this problem?" }] 
  };
  
  const messagesToRender = [initialGreetingMessage, ...messagesFromRedux];

  const [isThinking, setIsThinking] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm();
  const messagesEndRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesToRender, isThinking]);

  const onSubmit = async (data) => {
    const userMessageText = data.message.trim();
    if (!userMessageText) return;

    const userMessagePayload = { role: 'user', parts: [{ text: userMessageText }] };
    

    dispatch(addMessage(userMessagePayload));


    const messagesForApi = [...messagesFromRedux, userMessagePayload];

    reset();
    setIsThinking(true);

    try {
     
      const response = await fetch(`${backendUrl}/ai/chat`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          messages: messagesForApi,
          title: problem.title,
          description: problem.description,
          testCases: problem.visibleTestCases,
          startCode: problem.startCode
        })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (!response.body) throw new Error("Response body is missing!");

      dispatch(addMessage({ role: 'model', parts: [{ text: '' }] }));
      setIsThinking(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let isDone = false;

      while (!isDone) {
        const { value, done } = await reader.read();
        isDone = done;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          dispatch(appendToLastMessage(chunk));
        }
      }

    } catch (error) {
      console.error("Streaming Error:", error);
      dispatch(addMessage({
        role: 'model',
        parts: [{ text: "Sorry, I encountered an error. Please try again." }]
      }));
      setIsThinking(false);
    }
  };

  const themeClasses = {
    bg: theme === 'dark' ? 'bg-black' : 'bg-white',
    text: theme === 'dark' ? 'text-gray-200' : 'text-gray-900',
    border: theme === 'dark' ? 'border-gray-200/20' : 'border-gray-300',
    panelBg: theme === 'dark' ? 'bg-black ' : 'bg-gray-50',
    inputBg: theme === 'dark' ? 'bg-black' : ' bg-white ',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-end bg-black/60"
      onClick={onClose}
    >
      <div
        className={`fixed bottom-4 sm:bottom-8 right-4 sm:right-8 flex flex-col h-[70vh] max-h-[600px] w-full max-w-md rounded-xl shadow-2xl border ${themeClasses.border} ${themeClasses.bg}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between p-4 border-b ${themeClasses.border}`}>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bot className="text-purple-500" /> AI Assistant
          </h3>
          <button onClick={onClose} className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messagesToRender.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white flex items-center justify-center">
                  <Bot size={18} />
                </div>
              )}
              <div className={`max-w-[80%] rounded-lg px-4 py-2 text-left  ${msg.role === 'user' ? 'bg-blue-500 text-white' : ` border ${themeClasses.panelBg, themeClasses.border}`}`}>
                <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {msg.parts[0].text}
                </div>
              </div>
               {msg.role === 'user' && (
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${themeClasses.panelBg }`}>
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div className={`max-w-[80%] rounded-lg px-4 py-3 flex items-center gap-1.5 ${themeClasses.panelBg}`}>
                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={`p-4 border-t ${themeClasses.border}`}>
          <div className={`flex items-center p-1 rounded-lg border ${themeClasses.border} ${themeClasses.inputBg} focus-within:ring-2 focus-within:ring-blue-500`}>
            <input
              placeholder="Ask for a hint or explain the code..."
              className={`w-full bg-transparent px-3 py-1.5 text-sm focus:outline-none ${themeClasses.text}`}
              {...register("message", { required: true })}
              disabled={isThinking}
              autoComplete="off"
            />
            <button
              type="submit"
              className="p-2 rounded-md bg-blue-500 text-white disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
              disabled={isThinking || !formState.isValid}
            >
              {isThinking ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatAi;