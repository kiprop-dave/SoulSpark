import { z } from "zod";
import prisma from "../lib/prisma";
import { imageSchema } from "../types";
import { errorHandler } from "../utils/errorHandler";

const messageSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  text: z.string().optional(),
  seenBy: z.array(z.string()),
  senderId: z.string(),
  attachment: imageSchema.optional().nullable(),
});

const userSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  images: z.array(imageSchema),
}).strip();

const conversationSchema = z.object({
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
            id: userId
          }
        }
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            attachment: true
          }
        },
        participants: {
          select: {
            id: true,
            profile: {
              select: {
                first_name: true,
                images: true
              }
            }
          }
        }
      }
    });

    const validated = conversations.reduce((acc: Conversation[], curr) => {
      console.log(curr, 'curr')
      const c = conversationSchema.safeParse({
        id: curr.id,
        createdAt: curr.createdAt,
        participants: [{
          id: curr.participants[0].id,
          ...curr.participants[0].profile,
        }, {
          id: curr.participants[1].id,
          ...curr.participants[1].profile,
        }],
        messages: curr.messages
      });
      if (c.success) {
        acc.push(c.data);
      }
      return acc;
    }, []);
    console.log(validated, 'validated')

    return { status: "success", data: validated };
  } catch (err) {
    const error = errorHandler(err);
    console.log(error.type, error.message, 'error in getConversations');
    return { status: 'error', error: error.type };
  }
}
