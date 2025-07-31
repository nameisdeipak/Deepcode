import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chat: [],
  status: 'idle',
};

const aiChatSlice = createSlice({
  name: "aiChat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.chat.push(action.payload);
    },
    appendToLastMessage: (state, action) => {
      if (state.chat.length > 0) {
        const lastMessage = state.chat[state.chat.length - 1];
        if (lastMessage.parts && lastMessage.parts.length > 0) {
            lastMessage.parts[0].text += action.payload;
        }
      }
    },
    clearChat: (state) => {
      state.chat = []; 
    },
  },
});

export const { addMessage, appendToLastMessage, clearChat } = aiChatSlice.actions;
export default aiChatSlice.reducer;