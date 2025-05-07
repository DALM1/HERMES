import React from 'react';
import styled from 'styled-components';

interface UserAvatarProps {
  userId?: string;
  username?: string;
  avatarUrl?: string;
  size?: number;
}

const AvatarImage = styled.img<{ size?: number }>`
  width: ${({ size }) => size || 36}px;
  height: ${({ size }) => size || 36}px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserAvatar: React.FC<UserAvatarProps> = ({ userId, username, avatarUrl, size }) => {
  // Générer un avatar Hero UI basé sur l'ID de l'utilisateur ou le nom d'utilisateur
  const getDefaultAvatar = () => {
    const seed = userId || username || Math.random().toString(36).substring(2, 8);
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
  };

  return (
    <AvatarImage 
      src={avatarUrl || getDefaultAvatar()} 
      alt={username || 'Utilisateur'} 
      size={size}
    />
  );
};

export default UserAvatar;