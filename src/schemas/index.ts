import { z } from 'zod';

// Schéma utilisateur
export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  avatar: z.string().url().optional(),
  createdAt: z.string().or(z.date()),
  bio: z.string().max(500).optional(),
});

// Schéma groupe
export const GroupSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(50),
  description: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  banner: z.string().url().optional(),
  isPublic: z.boolean().default(true),
  createdAt: z.string().or(z.date()),
  ownerId: z.string(),
  memberCount: z.number().default(0),
});

// Schéma post
export const PostSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(100),
  content: z.string().optional(),
  mediaUrl: z.string().url().optional(),
  authorId: z.string(),
  author: UserSchema.optional(),
  groupId: z.string(),
  group: GroupSchema.optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()).optional(),
  likeCount: z.number().default(0),
  commentCount: z.number().default(0),
  isLiked: z.boolean().default(false),
});

// Schéma commentaire
export const CommentSchema = z.object({
  id: z.string(),
  content: z.string().min(1),
  authorId: z.string(),
  author: UserSchema.optional(),
  postId: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()).optional(),
  likeCount: z.number().default(0),
  isLiked: z.boolean().default(false),
});

// Schéma message
export const MessageSchema = z.object({
  id: z.string(),
  content: z.string().min(1),
  authorId: z.string(),
  author: UserSchema.optional(),
  groupId: z.string(),
  createdAt: z.string().or(z.date()),
  attachments: z.array(z.string().url()).optional(),
});

// Types dérivés des schémas
export type User = z.infer<typeof UserSchema>;
export type Group = z.infer<typeof GroupSchema>;
export type Post = z.infer<typeof PostSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type Message = z.infer<typeof MessageSchema>;