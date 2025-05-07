import React, { useState } from 'react';
import styled from 'styled-components';
import { sendMessage } from '../../api/messages';

interface MessageInputProps {
  conversationId: string;
}

// Styled Components
const InputContainer = styled.form`
  display: flex;
  padding: 1rem;
  background-color: ${props => props.theme.colors.surface};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.textPrimary};
  outline: none;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  margin-left: 0.5rem;
  padding: 0 1.25rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-weight: 600;
  border: none;
  transition: background-color 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.secondary};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      await sendMessage(conversationId, message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <InputContainer onSubmit={handleSubmit}>
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={sending}
      />
      <SendButton 
        type="submit" 
        disabled={!message.trim() || sending}
      >
        Send
      </SendButton>
    </InputContainer>
  );
};

export default MessageInput;