import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * 💬 Chat Slice — Real-Time Messaging State
 * Manages: conversations list, active messages, typing, online status
 */

export interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatUser {
  _id: string;
  fullname: string;
  profilePhoto?: string;
  role: string;
}

export interface Conversation {
  user: ChatUser;
  lastMessage: ChatMessage;
  unreadCount: number;
  isOnline?: boolean;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationUserId: string | null;
  messages: ChatMessage[];
  typingUsers: string[]; // array of userIds who are typing
  onlineUsers: string[]; // array of userIds who are online
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  activeConversationUserId: null,
  messages: [],
  typingUsers: [],
  onlineUsers: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSending: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // ─── Conversations ─────────────────────────────────────────
    setConversationsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingConversations = action.payload;
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      state.isLoadingConversations = false;
    },

    // ─── Active Chat ────────────────────────────────────────────
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationUserId = action.payload;
      state.messages = [];
      state.typingUsers = [];
    },

    // ─── Messages ───────────────────────────────────────────────
    setMessagesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMessages = action.payload;
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
      state.isLoadingMessages = false;
    },
    appendMessage: (state, action: PayloadAction<ChatMessage>) => {
      // Prevent duplicate messages
      const exists = state.messages.find(m => m._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
      // Update conversation last message
      const convoIndex = state.conversations.findIndex(
        c => c.user._id === action.payload.senderId || c.user._id === action.payload.receiverId
      );
      if (convoIndex !== -1) {
        state.conversations[convoIndex].lastMessage = action.payload;
        // If this is incoming message (not from active chat), increment unread
        if (action.payload.senderId !== state.activeConversationUserId &&
            action.payload.senderId !== action.payload.receiverId) {
          state.conversations[convoIndex].unreadCount += 1;
        }
      }
    },
    setSending: (state, action: PayloadAction<boolean>) => {
      state.isSending = action.payload;
    },

    // ─── Mark Read ──────────────────────────────────────────────
    markConversationRead: (state, action: PayloadAction<string>) => {
      const convo = state.conversations.find(c => c.user._id === action.payload);
      if (convo) {
        convo.unreadCount = 0;
      }
      // Mark all messages in current view as read
      state.messages.forEach(msg => {
        if (msg.senderId === action.payload) {
          msg.isRead = true;
        }
      });
    },

    // ─── Typing Indicators ──────────────────────────────────────
    addTypingUser: (state, action: PayloadAction<string>) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action: PayloadAction<string>) => {
      state.typingUsers = state.typingUsers.filter(id => id !== action.payload);
    },

    // ─── Online Status ──────────────────────────────────────────
    addOnlineUser: (state, action: PayloadAction<string>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
      // Update conversation online status
      const convo = state.conversations.find(c => c.user._id === action.payload);
      if (convo) convo.isOnline = true;
    },
    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
      const convo = state.conversations.find(c => c.user._id === action.payload);
      if (convo) convo.isOnline = false;
    },

    // ─── Error ──────────────────────────────────────────────────
    setChatError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // ─── Reset ──────────────────────────────────────────────────
    resetChat: () => initialState,
  },
});

export const {
  setConversationsLoading,
  setConversations,
  setActiveConversation,
  setMessagesLoading,
  setMessages,
  appendMessage,
  setSending,
  markConversationRead,
  addTypingUser,
  removeTypingUser,
  addOnlineUser,
  removeOnlineUser,
  setChatError,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
