import { apiClient } from './client';

export interface Conversation {
  id: number;
  name: string;
  description: string;
  is_group: boolean;
  type: string;
  last_message_at?: string;
  is_public?: boolean;
  category?: string;
  icon?: string;
  inserted_at: string;
  updated_at: string;
}

export interface ConversationMember {
  id: number;
  role: string;
  joined_at: string;
  last_read_at?: string;
  is_muted: boolean;
  is_pinned: boolean;
  conversation_id: number;
  user_id: number;
}

export interface Message {
  id: number;
  content: string;
  content_type: string;
  user_id: number;
  conversation_id: number;
  inserted_at: string;
  updated_at: string;
}

// Récupérer toutes les conversations de l'utilisateur
export const getConversations = async () => {
  try {
    const response = await apiClient.get('/conversations');
    return response.data.conversations;
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    throw error;
  }
};

// Récupérer une conversation spécifique
export const getConversation = async (id: number) => {
  try {
    const response = await apiClient.get(`/conversations/${id}`);
    return response.data.conversation;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la conversation ${id}:`, error);
    throw error;
  }
};

// Créer une nouvelle conversation
export const createConversation = async (conversationData: {
  name: string;
  description: string;
  is_group: boolean;
  type: string;
}) => {
  try {
    // Structure exacte comme dans la requête cURL
    const response = await apiClient.post('/conversations', {
      conversation: conversationData
    });
    return response.data.conversation;
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error);
    throw error;
  }
};

// Ajouter un membre à une conversation
export const addMemberToConversation = async (conversationId: number, userId: number) => {
  try {
    // Structure exacte comme dans la requête cURL
    const response = await apiClient.post(`/conversations/${conversationId}/members`, {
      user_id: userId
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de l'ajout d'un membre à la conversation ${conversationId}:`, error);
    throw error;
  }
};

// Récupérer les messages d'une conversation
export const getConversationMessages = async (conversationId: number) => {
  try {
    const response = await apiClient.get(`/conversations/${conversationId}/messages`);
    return response.data.messages;
  } catch (error) {
    console.error(`Erreur lors de la récupération des messages de la conversation ${conversationId}:`, error);
    throw error;
  }
};

// Ajouter un message à une conversation
export const sendMessage = async (conversationId: number, messageData: {
  content: string;
  content_type: string;
}) => {
  try {
    const response = await apiClient.post(`/conversations/${conversationId}/messages`, {
      message: {
        ...messageData,
        conversation_id: conversationId
      }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de l'envoi d'un message à la conversation ${conversationId}:`, error);
    throw error;
  }
};

// Marquer une conversation comme lue
export const markConversationAsRead = async (conversationId: number) => {
  try {
    const response = await apiClient.post(`/conversations/${conversationId}/read`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors du marquage de la conversation ${conversationId} comme lue:`, error);
    throw error;
  }
};
