import React from 'react';
import styled from 'styled-components';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

// Styled Components
const MessageContainer = styled.div<{ isCurrentUser: boolean }>`
  display: flex;
  justify-content: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 1rem;
`;

const MessageContent = styled.div<{ isCurrentUser: boolean }>`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background-color: ${props => props.isCurrentUser ? 
    props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.theme.colors.textPrimary};
  box-shadow: ${props => props.theme.shadows.small};
`;

const MessageSender = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const MessageText = styled.div`
  word-break: break-word;
`;

const MessageTime = styled.div`
  font-size: 0.7rem;
  text-align: right;
  margin-top: 0.25rem;
  opacity: 0.7;
`;

const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  return (
    <MessageContainer isCurrentUser={isCurrentUser}>
      <MessageContent isCurrentUser={isCurrentUser}>
        {!isCurrentUser && <MessageSender>{message.sender.name}</MessageSender>}
        <MessageText>{message.content}</MessageText>
        <MessageTime>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </MessageTime>
      </MessageContent>
    </MessageContainer>
  );
};

export default MessageItem;