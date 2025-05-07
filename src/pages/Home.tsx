import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainLayout from '../components/layout/MainLayout';
import Post from '../components/feed/Post';
import { Post as PostType } from '../types/post';
import { fetchPosts } from '../api/posts';

const FeedContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const FeedTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.colors.text};
`;

const CreatePostButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.large};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPosts()
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des posts:', error);
        setLoading(false);
      });
  }, []);

  return (
    <MainLayout>
      <FeedContainer>
        <FeedHeader>
          <FeedTitle></FeedTitle>
          <CreatePostButton>Créer un post</CreatePostButton>
        </FeedHeader>

        {loading ? (
          <LoadingMessage>Chargement des posts...</LoadingMessage>
        ) : posts.length > 0 ? (
          posts.map(post => <Post key={post.id} post={post} />)
        ) : (
          <LoadingMessage>Aucun post à afficher.</LoadingMessage>
        )}
      </FeedContainer>
    </MainLayout>
  );
};

export default Home;
