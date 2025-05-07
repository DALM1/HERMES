import { z } from 'zod';
import { UserSchema } from './auth';

export const GroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  isPublic: z.boolean().default(true),
  banner: z.string().optional(),
  avatar: z.string().optional(),
  createdAt: z.string().or(z.date()),
  membersCount: z.number().default(0),
  owner: UserSchema,
  isMember: z.boolean().default(false)
});

export type Group = z.infer<typeof GroupSchema>;