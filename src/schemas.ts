export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  memberCount: number;
  isPrivate: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  mediaUrl?: string;
  author?: {
    id: string;
    username: string;
    avatar?: string;
  };
  group?: {
    id: string;
    name: string;
    avatar?: string;
  };
}