import { Post } from '../types/post';
import { apiClient } from './client';

// Récupérer tous les posts
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await apiClient.get('/api/posts');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    throw error;
  }
};

// Récupérer un post par son ID
export const fetchPostById = async (postId: string): Promise<Post> => {
  try {
    const response = await apiClient.get(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du post ${postId}:`, error);
    throw error;
  }
};

// Créer un nouveau post
export const createPost = async (postData: FormData): Promise<Post> => {
  try {
    const response = await apiClient.post('/api/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    throw error;
  }
};

// Mettre à jour un post
export const updatePost = async (postId: string, postData: FormData): Promise<Post> => {
  try {
    const response = await apiClient.put(`/api/posts/${postId}`, postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du post ${postId}:`, error);
    throw error;
  }
};

// Supprimer un post
export const deletePost = async (postId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/posts/${postId}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du post ${postId}:`, error);
    throw error;
  }
};

// Liker un post
export const likePost = async (postId: string, isLiked: boolean): Promise<void> => {
  try {
    if (isLiked) {
      await apiClient.post(`/api/posts/${postId}/like`);
    } else {
      await apiClient.delete(`/api/posts/${postId}/like`);
    }
  } catch (error) {
    console.error(`Erreur lors du like/unlike du post ${postId}:`, error);
    throw error;
  }
};