import { apiRequest } from './index';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  createdAt: string;
}

/**
 * Récupère les messages d'une conversation
 * @param conversationId - L'identifiant de la conversation
 * @returns La liste des messages
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  return apiRequest<Message[]>(`conversations/${conversationId}/messages`);
}

/**
 * Envoie un nouveau message dans une conversation
 * @param conversationId - L'identifiant de la conversation
 * @param content - Le contenu du message
 * @returns Le message créé
 */
export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  return apiRequest<Message>(`conversations/${conversationId}/messages`, {
    method: 'POST',
    body: { content }
  });
}