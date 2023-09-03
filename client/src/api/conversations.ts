import axios from 'axios';
import { z } from 'zod';
import { imageSchema } from '@/types';
import { api } from './base';

import { PossibleError } from './matches';

const userSchema = z
  .object({
    id: z.string(),
    first_name: z.string(),
    images: z.array(imageSchema),
  })
  .strip();
export type User = z.infer<typeof userSchema>;

export const messageSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  text: z.string().optional(),
  seenBy: z.array(z.string()),
  senderId: z.string(),
  attachment: imageSchema.optional().nullable(),
});
export type Message = z.infer<typeof messageSchema>;

export const conversationSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  participants: z.tuple([userSchema, userSchema]),
  messages: z.array(messageSchema),
});
export type Conversation = z.infer<typeof conversationSchema>;

type GetConversationsResult =
  | { status: 'success'; data: Conversation[] }
  | { status: 'error'; error: PossibleError };
export const getConversations = async (token: string): Promise<GetConversationsResult> => {
  try {
    const response = await api.get('/conversations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];
    const validated = data.reduce((acc: Conversation[], curr) => {
      const result = conversationSchema.safeParse(curr);
      if (result.success) {
        acc.push(result.data);
      }
      return acc;
    }, []);
    return { status: 'success', data: validated };
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      if (err.response?.status === 401) {
        return { status: 'error', error: 'unauthorized' };
      }
      return { status: 'error', error: 'serverError' };
    } else {
      return { status: 'error', error: 'unknownError' };
    }
  }
};

const messagePosted = messageSchema.extend({
  conversationId: z.string(),
});

export type MessagePosted = z.infer<typeof messagePosted>;

type PostMessageResult =
  | { status: 'success'; data: MessagePosted }
  | { status: 'error'; error: string };

const postMessageInput = z.union([
  z.object({
    format: z.literal('text'),
    body: z.string(),
  }),
  z.object({
    format: z.literal('media'),
    body: imageSchema,
  }),
]);
export type PostMessageInput = z.infer<typeof postMessageInput>;

export const postMessage = async (
  token: string,
  conversationId: string,
  input: PostMessageInput
): Promise<PostMessageResult> => {
  try {
    const response = await api.post(`/conversations/${conversationId}`, input, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = messagePosted.safeParse(response.data);
    if (result.success) {
      return { status: 'success', data: result.data };
    }
    console.log(result.error);
    return { status: 'error', error: 'unknownError' };
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      if (err.response?.status === 401) {
        return { status: 'error', error: 'unauthorized' };
      }
      return { status: 'error', error: 'serverError' };
    } else {
      return { status: 'error', error: 'unknownError' };
    }
  }
};
