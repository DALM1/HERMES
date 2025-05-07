import { apiClient } from './client';

export interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  unread: number;
  avatar: string | null;
  lastActive: Date;
}

export const getConversations = async () => {
  const response = await apiClient.get('/api/conversations');
  return response.data.conversations;
};

export const getConversation = async (id: number) => {
  const response = await apiClient.get(`/api/conversations/${id}`);
  return response.data.conversation;
};

// ... existing code ...