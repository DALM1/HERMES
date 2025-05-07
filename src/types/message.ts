import { z } from 'zod';
import { UserSchema } from './auth';

export const MessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  author: UserSchema,
  groupId: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()).optional(),
  attachments: z.array(z.object({
    id: z.string(),
    url: z.string(),
    type: z.enum(['image', 'video', 'file']),
    name: z.string().optional()
  })).optional()
});

export type Message = z.infer<typeof MessageSchema>;