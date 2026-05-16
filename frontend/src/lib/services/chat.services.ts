import apiClient from '../apiClient';
import { ChatMessage, Conversation } from '@/store/chatSlice';

/**
 * 💬 Chat Service
 * Handles all HTTP API calls for messaging.
 * Socket.io real-time events are handled separately via useChatSocket hook.
 */
export const chatService = {
  /**
   * Get all conversations (chat list with last message & unread count)
   * GET /api/v1/chat/my-chats
   */
  getMyChats: async (): Promise<{ data: Conversation[] }> => {
    const response = await apiClient.get('/chat/my-chats');
    return response.data;
  },

  /**
   * Get full conversation history with a specific user
   * GET /api/v1/chat/messages/:userId
   */
  getMessages: async (userId: string): Promise<{ data: ChatMessage[] }> => {
    const response = await apiClient.get(`/chat/messages/${userId}`);
    return response.data;
  },

  /**
   * Send a message to a user
   * POST /api/v1/chat/send
   */
  sendMessage: async (receiverId: string, content: string): Promise<{ data: ChatMessage }> => {
    const response = await apiClient.post('/chat/send', { receiverId, content });
    return response.data;
  },
};
