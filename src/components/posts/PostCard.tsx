import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    media_url?: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
    group: {
      id: string;
      name: string;
    };
    author: {
      id: string;
      username: string;
    };
  };
}

const Card = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const CardHeader = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const GroupIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  margin-right: 0.75rem;
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const GroupName = styled(Link)`
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PostMeta = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const MediaContainer = styled.div`
  width: 100%;
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background-color: rgba(0, 0, 0, 0.2);
`;

const PostImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const PostTitle = styled(Link)`
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.textPrimary};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const PostText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const CardFooter = styled.div`
  display: flex;
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const FooterButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  padding: 0.5rem;
  margin-right: 1rem;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ButtonText = styled.span`
  margin-left: 0.5rem;
`;

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Card>
      <CardHeader>
        <GroupIcon>{post.group.name.charAt(0).toUpperCase()}</GroupIcon>
        <HeaderInfo>
          <GroupName to={`/groups/${post.group.id}`}>{post.group.name}</GroupName>
          <PostMeta>
            Posté par {post.author.username} • {new Date(post.created_at).toLocaleDateString()}
          </PostMeta>
        </HeaderInfo>
      </CardHeader>
      
      {post.media_url && (
        <MediaContainer>
          <PostImage src={post.media_url} alt={post.title} />
        </MediaContainer>
      )}
      
      <CardContent>
        <PostTitle to={`/posts/${post.id}`}>{post.title}</PostTitle>
        <PostText>{post.content}</PostText>
      </CardContent>
      
      <CardFooter>
        <FooterButton>
          <span role="img" aria-label="like">👍</span>
          <ButtonText>{post.likes_count}</ButtonText>
        </FooterButton>
        
        <FooterButton>
          <span role="img" aria-label="comment">💬</span>
          <ButtonText>{post.comments_count}</ButtonText>
        </FooterButton>
      </CardFooter>
    </Card>
  );
};

export default PostCard;