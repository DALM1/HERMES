import React, { useEffect, useState, useRef } from 'react';
import { webSocketService } from '../../api/websocket';
import { getMessages } from '../../api/messages';
import MessageItem from '../MessageItem';
import MessageInput from './MessageInput';
import './MessageList.css';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface MessageListProps {
  conversationId: string;
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ conversationId, currentUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessages(conversationId);
        setMessages(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Connexion WebSocket
    webSocketService.connect().catch(console.error);

    // Abonnement aux nouveaux messages
    const handleNewMessage = (message: Message) => {
      if (message.sender.id !== currentUserId) {
        // Jouer un son de notification
        const audio = new Audio('/assets/notification.mp3');
        audio.play().catch(console.error);
      }

      setMessages(prev => [...prev, message]);
    };

    webSocketService.subscribe('new_message', handleNewMessage);

    return () => {
      webSocketService.unsubscribe('new_message', handleNewMessage);
    };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading && messages.length === 0) {
    return <div className="loading-container">Chargement des messages</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="message-container">
      <div className="message-list">
        {messages.map(message => (
          <MessageItem
            key={message.id}
            message={message}
            isOwnMessage={message.sender.id === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput conversationId={conversationId} />
    </div>
  );
};

export default MessageList;
