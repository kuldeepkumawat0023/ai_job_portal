'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { TOKEN_KEY } from '@/lib/apiClient';
import {
  appendMessage,
  addTypingUser,
  removeTypingUser,
  addOnlineUser,
  removeOnlineUser,
  markConversationRead,
  ChatMessage,
} from '@/store/chatSlice';

/**
 * 🔌 useChatSocket Hook
 * 
 * Manages the entire Socket.io lifecycle for real-time messaging:
 * - Authenticates socket connection with JWT
 * - Listens for incoming messages and dispatches to Redux
 * - Handles typing indicators, online status, and read receipts
 * - Auto-cleanup on unmount
 * 
 * Usage:
 *   const { sendTyping, stopTyping, markRead } = useChatSocket();
 */

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useChatSocket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const socketRef = useRef<Socket | null>(null);
  const activeConversationUserId = useSelector(
    (state: RootState) => state.chat.activeConversationUserId
  );

  // ─── Connect Socket on Mount ──────────────────────────────────────
  useEffect(() => {
    // Get JWT token
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem(TOKEN_KEY) || ''
        : '';

    if (!token) return;

    // Initialize Socket.io with auth token
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    // ─── Connection Events ──────────────────────────────────────────
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    // ─── Incoming Message ───────────────────────────────────────────
    socket.on('receiveMessage', (message: ChatMessage) => {
      dispatch(appendMessage(message));

      // Auto mark as read if this chat is currently open
      if (activeConversationUserId === message.senderId) {
        socket.emit('mark_read', { from: message.senderId });
        dispatch(markConversationRead(message.senderId));
      }
    });

    // ─── Sent Message Confirmation ──────────────────────────────────
    socket.on('messageSent', (message: ChatMessage) => {
      dispatch(appendMessage(message));
    });

    // ─── Typing Indicators ──────────────────────────────────────────
    socket.on('typing', ({ from }: { from: string }) => {
      dispatch(addTypingUser(from));
    });

    socket.on('stop_typing', ({ from }: { from: string }) => {
      dispatch(removeTypingUser(from));
    });

    // ─── Read Receipts ──────────────────────────────────────────────
    socket.on('messages_read', ({ by }: { by: string }) => {
      dispatch(markConversationRead(by));
    });

    // ─── Online Status ──────────────────────────────────────────────
    socket.on('user_online', ({ userId }: { userId: string }) => {
      dispatch(addOnlineUser(userId));
    });

    socket.on('user_offline', ({ userId }: { userId: string }) => {
      dispatch(removeOnlineUser(userId));
    });

    // ─── Cleanup on Unmount ─────────────────────────────────────────
    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('receiveMessage');
      socket.off('messageSent');
      socket.off('typing');
      socket.off('stop_typing');
      socket.off('messages_read');
      socket.off('user_online');
      socket.off('user_offline');
      socket.disconnect();
      socketRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // ─── Re-emit mark_read when active conversation changes ───────────
  useEffect(() => {
    if (activeConversationUserId && socketRef.current) {
      socketRef.current.emit('mark_read', { from: activeConversationUserId });
      dispatch(markConversationRead(activeConversationUserId));
    }
  }, [activeConversationUserId, dispatch]);

  // ─── Public Methods ───────────────────────────────────────────────

  /**
   * Emit typing event to a specific user
   */
  const sendTyping = useCallback((toUserId: string) => {
    socketRef.current?.emit('typing', { to: toUserId });
  }, []);

  /**
   * Emit stop_typing event to a specific user
   */
  const stopTyping = useCallback((toUserId: string) => {
    socketRef.current?.emit('stop_typing', { to: toUserId });
  }, []);

  /**
   * Emit mark_read event after reading messages
   */
  const markRead = useCallback((fromUserId: string) => {
    socketRef.current?.emit('mark_read', { from: fromUserId });
    dispatch(markConversationRead(fromUserId));
  }, [dispatch]);

  /**
   * Check if socket is connected
   */
  const isConnected = useCallback(() => {
    return socketRef.current?.connected ?? false;
  }, []);

  return {
    sendTyping,
    stopTyping,
    markRead,
    isConnected,
    socket: socketRef.current,
  };
};
