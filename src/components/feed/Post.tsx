import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Post as PostType } from '../../schemas';
import { likePost } from '../../api/posts';
import UserAvatar from '../common/UserAvatar';

interface PostProps {
  post: PostType;
}

const PostCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  overflow: hidden;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const AvatarWrapper = styled.div`
  margin-right: ${({ theme }) => theme.spacing.small};
`;

const PostInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const GroupName = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PostDate = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: ${({ theme }) => theme.spacing.small};
`;

const PostTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const PostContent = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-line;
`;

const PostMedia = styled.div`
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  
  img, video {
    width: 100%;
    object-fit: contain;
  }
`;

const PostActions = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing.medium};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActionButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.small};
  margin-right: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  cursor: pointer;
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.xsmall};
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Post: React.FC<PostProps> = ({ post }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { 
    addSuffix: true,
    locale: fr
  });
  
  const isImage = post.mediaUrl?.match(/\.(jpeg|jpg|gif|png)$/i);
  const isVideo = post.mediaUrl?.match(/\.(mp4|webm|ogg)$/i);
  
  // Générer un avatar Hero UI basé sur l'ID de l'utilisateur ou un hash du nom d'utilisateur
  const getDefaultAvatar = () => {
    const userId = post.authorId || '1';
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`;
  };
  
  const handleLike = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const newLikedState = !liked;
      
      // Optimistic update
      setLiked(newLikedState);
      setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
      
      // API call
      await likePost(post.id, newLikedState);
    } catch (error) {
      // Revert on error
      console.error('Erreur lors du like:', error);
      setLiked(!liked);
      setLikesCount(prev => liked ? prev + 1 : prev - 1);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleComment = () => {
    // Rediriger vers la page de détail du post
    window.location.href = `/posts/${post.id}`;
  };
  
  return (
    <PostCard>
      <PostHeader>
        <AvatarWrapper>
          <UserAvatar 
            userId={post.authorId}
            username={post.author?.username}
            avatarUrl={post.author?.avatar}
            size={36}
          />
        </AvatarWrapper>
        <PostInfo>
          <AuthorName to={`/users/${post.authorId}`}>
            {post.author?.username || 'Utilisateur'}
          </AuthorName>
          {' '}dans{' '}
          <GroupName to={`/groups/${post.groupId}`}>
            {post.group?.name || 'Groupe'}
          </GroupName>
          <PostDate>{formattedDate}</PostDate>
        </PostInfo>
      </PostHeader>
      
      <PostTitle>{post.title}</PostTitle>
      
      {post.content && (
        <PostContent>{post.content}</PostContent>
      )}
      
      {post.mediaUrl && (
        <PostMedia>
          {isImage && <img src={post.mediaUrl} alt={post.title} />}
          {isVideo && (
            <video controls>
              <source src={post.mediaUrl} />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          )}
        </PostMedia>
      )}
      
      <PostActions>
        <ActionButton 
          active={liked} 
          onClick={handleLike}
          disabled={isSubmitting}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14" />
          </svg>
          {likesCount}
        </ActionButton>
        
        <ActionButton onClick={handleComment}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" />
          </svg>
          {post.commentsCount || 0}
        </ActionButton>
        
        <ActionButton>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" />
            <path d="M16 6L12 2L8 6" />
            <path d="M12 2V15" />
          </svg>
          Partager
        </ActionButton>
      </PostActions>
    </PostCard>
  );
};

export default Post;