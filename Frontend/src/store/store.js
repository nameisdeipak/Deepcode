import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../authSlice";
import aiChatReducer from "../aiChatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    aichat: aiChatReducer,
  },
});
