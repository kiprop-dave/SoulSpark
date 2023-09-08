import { z } from 'zod';
import prisma from '../lib/prisma';
import { imageSchema } from '../types';
import { errorHandler } from '../utils/errorHandler';
import { pusherServer } from '../lib/pusher';

export const messageSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  text: z.string().optional().nullable(),
  seenBy: z.array(z.string()),
  senderId: z.string(),
  attachment: imageSchema.optional().nullable(),
  gifUrl: z.string().optional().nullable(),
});
export type Message = z.infer<typeof messageSchema>;

export const userSchema = z
  .object({
    id: z.string(),
    first_name: z.string(),
    images: z.array(imageSchema),
  })
  .strip();

export const conversationSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  participants: z.tuple([userSchema, userSchema]),
  messages: z.array(messageSchema),
});
type Conversation = z.infer<typeof conversationSchema>;

type GetConversationsResult =
  | { status: 'success'; data: Conversation[] }
  | { status: 'error'; error: string };
export const getConversations = async (userId: string): Promise<GetConversationsResult> => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            attachment: true,
            seenBy: {
              select: {
                id: true,
              },
            },
          },
        },
        participants: {
          select: {
            id: true,
            profile: {
              select: {
                first_name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const validated = conversations.reduce((acc: Conversation[], curr) => {
      const messages = curr.messages.reduce((acc: Message[], curr) => {
        const m = messageSchema.safeParse({
          id: curr.id,
          createdAt: curr.createdAt,
          text: curr.text,
          seenBy: curr.seenBy.map((user) => user.id),
          senderId: curr.senderId,
          attachment: curr.attachment,
          gifUrl: curr.gifUrl,
        });
        if (m.success) {
          acc.push(m.data);
        }
        return acc;
      }, []);
      const c = conversationSchema.safeParse({
        id: curr.id,
        createdAt: curr.createdAt,
        participants: [
          {
            id: curr.participants[0].id,
            ...curr.participants[0].profile,
          },
          {
            id: curr.participants[1].id,
            ...curr.participants[1].profile,
          },
        ],
        messages: messages,
      });
      if (c.success) {
        acc.push(c.data);
      }
      return acc;
    }, []);

    return { status: 'success', data: validated };
  } catch (err) {
    const error = errorHandler(err);
    console.log(error.type, error.message, 'error in getConversations');
    return { status: 'error', error: error.type };
  }
};

export const messagePosted = messageSchema.extend({
  conversationId: z.string(),
});

type PostMessageResult =
  | { status: 'success'; data: z.infer<typeof messagePosted> }
  | { status: 'error'; error: string };

export const postMessageInput = z.union([
  z.object({
    format: z.literal('text'),
    body: z.string(),
  }),
  z.object({
    format: z.literal('photo'),
    body: imageSchema,
  }),
  z.object({
    format: z.literal('gif'),
    body: z.string(),
  }),
]);
type PostMessageInput = z.infer<typeof postMessageInput>;

export const postMessage = async (
  userId: string,
  conversationId: string,
  message: PostMessageInput
): Promise<PostMessageResult> => {
  try {
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        messages: {
          create: {
            text: message.format === 'text' ? message.body : undefined,
            attachment: {
              create: message.format === 'photo' ? message.body : undefined,
            },
            gifUrl: message.format === 'gif' ? message.body : undefined,
            senderId: userId,
            seenBy: {
              connect: {
                id: userId,
              },
            },
          },
        },
        updatedAt: new Date(),
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            attachment: true,
            seenBy: {
              select: {
                id: true,
              },
            },
          },
        },
        participants: true,
      },
    });

    const validated = messagePosted.safeParse({
      id: updatedConversation.messages[0].id,
      createdAt: updatedConversation.messages[0].createdAt,
      text: updatedConversation.messages[0].text,
      seenBy: updatedConversation.messages[0].seenBy.map((user) => user.id),
      senderId: updatedConversation.messages[0].senderId,
      attachment: updatedConversation.messages[0].attachment,
      conversationId: updatedConversation.id,
      gifUrl: updatedConversation.messages[0].gifUrl,
    });

    if (validated.success) {
      const otherUser = updatedConversation.participants.find((user) => user.id !== userId)!; // Guaranteed to exist
      await pusherServer.trigger(`private-user-${otherUser.id}`, 'new-message', validated.data); // Send pusher notification to other user
      return { status: 'success', data: validated.data }; // The sender will receive the update through normal rest api
    }
    return { status: 'error', error: 'validation' };
  } catch (err) {
    const error = errorHandler(err);
    console.log(error.type, error.message, 'error in postMessage');
    return { status: 'error', error: error.type };
  }
};

type MarkMessagesSeenResult = { status: 'success' } | { status: 'error'; error: string };
export const markMessagesSeen = async (
  userId: string,
  messageIds: string[]
): Promise<MarkMessagesSeenResult> => {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        seenMessages: {
          connect: messageIds.map((id) => ({ id })),
        },
      },
    });
    return { status: 'success' };
  } catch (err) {
    const error = errorHandler(err);
    console.log(error.type, error.message, 'error in markMessagesSeen');
    return { status: 'error', error: error.type };
  }
};
