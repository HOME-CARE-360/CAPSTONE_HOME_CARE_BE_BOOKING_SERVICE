// chat.model.ts
import { ChatSenderType } from '@prisma/client';
import { z } from 'zod';

export const CreateConversationBodySchema = z.object({
    providerId: z.number().int().min(1),
});

export const ConversationSchema = z.object({
    id: z.number().int(),
    customerId: z.number().int(),
    providerId: z.number().int(),
    lastMessage: z.string().nullable(),
    lastMessageAt: z.date().nullable(),
    unreadByCustomer: z.number().int(),
    unreadByProvider: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const MessageSchema = z.object({
    id: z.number().int(),
    conversationId: z.number().int(),
    senderId: z.number().int(),
    senderType: z.nativeEnum(ChatSenderType),
    content: z.string().optional(),
    imageUrl: z.string().url().optional(),
    isRead: z.boolean(),
    sentAt: z.date(),
});

// Create Message
export const CreateMessageBodySchema = z.object({
    conversationId: z.number().int(),
    content: z.string().optional(),
    imageUrl: z.string().url().optional(),
});

// Query: Get message list
export const GetListMessageQuerySchema = z.object({
    conversationId: z.number().int(),
    page: z.coerce.number().int().default(1),
    limit: z.coerce.number().int().default(20),
});

// Response: paginated
export const PaginatedMessagesSchema = z.object({
    data: z.array(MessageSchema),
    pagination: z.object({
        page: z.number().int(),
        limit: z.number().int(),
        totalItems: z.number().int(),
        totalPages: z.number().int(),
    }),
});

// Type Inference
export type CreateConversationBodyType = z.infer<typeof CreateConversationBodySchema>;
export type CreateMessageBodyType = z.infer<typeof CreateMessageBodySchema>;
export type GetListMessageQueryType = z.infer<typeof GetListMessageQuerySchema>;
export type MessageType = z.infer<typeof MessageSchema>;
export type ConversationType = z.infer<typeof ConversationSchema>;
