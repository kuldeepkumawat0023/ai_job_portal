'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setConversations, setConversationsLoading } from '@/store/chatSlice';
import { chatService } from '@/lib/services/chat.services';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useAuth } from '@/hooks/useAuth';

/**
 * 🗨️ ChatProvider
 * This component manages the global chat state and socket connection.
 * It should be wrapped around the authenticated parts of the app (Candidate/Recruiter layouts).
 */
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();
  
  // Initialize Socket.io connection globally
  // This hook handles connect/disconnect and event listeners
  const { isConnected } = useChatSocket();

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadInitialChats = async () => {
      dispatch(setConversationsLoading(true));
      try {
        const res = await chatService.getMyChats();
        dispatch(setConversations(res.data || []));
      } catch (err) {
        console.error('[ChatProvider] Failed to fetch initial chats:', err);
        dispatch(setConversationsLoading(false));
      }
    };

    loadInitialChats();
    
    // Refresh chats every 2 minutes just in case socket missed something
    const interval = setInterval(loadInitialChats, 120000);
    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
};
