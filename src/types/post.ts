import { z } from 'zod';
import { UserSchema } from './auth';

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  mediaUrl: z.string().optional(),
  author: UserSchema,
  groupId: z.string(),
  groupName: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()).optional(),
  likesCount: z.number().default(0),
  commentsCount: z.number().default(0),
  isLiked: z.boolean().default(false)
});

export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  author: UserSchema,
  postId: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()).optional(),
  likesCount: z.number().default(0),
  isLiked: z.boolean().default(false)
});

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
export type Comment = z.infer<typeof CommentSchema>;