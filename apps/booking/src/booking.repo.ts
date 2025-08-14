import { Injectable } from "@nestjs/common";
import { ChatSenderType, RequestStatus } from "@prisma/client";
import { RoleName } from "libs/common/src/constants/role.constant";
import { CancelBookingType, CreateServiceRequestBodyType } from "libs/common/src/request-response-type/booking/booking.model";
import { CreateMessageBodyType, GetListMessageQueryType } from "libs/common/src/request-response-type/chat/chat.model";
import { PrismaService } from "libs/common/src/services/prisma.service";
import { AccessTokenPayload } from "libs/common/src/types/jwt.type";



@Injectable()
export class BookingRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async createServiceRequest(body: CreateServiceRequestBodyType, customerId: number) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { paymentMethod, ...rest } = body
        return await this.prismaService.serviceRequest.create({
            data: {
                ...rest,
                customerId,
                status: RequestStatus.WAIT_FOR_PAYMENT


            }
        })
    }
    async cancelBooking(body: CancelBookingType) {
        return await this.prismaService.serviceRequest.update({
            where: {
                id: body.id
            }, data: {
                status: RequestStatus.CANCELLED
            }
        })
    }
    async getUserConversations(user: AccessTokenPayload) {
        let where = {};

        if (user.customerId) {
            where = { customerId: user.customerId };
        } else if (user.providerId) {
            where = { providerId: user.providerId };
        }
        return await this.prismaService.conversation.findMany({
            where,
            orderBy: { lastMessageAt: 'desc' },
            include: {

                ServiceProvider: {
                    select: {
                        id: true,
                        user: {
                            select: { name: true, avatar: true }
                        }
                    }
                },
                CustomerProfile: {
                    select: {
                        id: true,
                        user: {
                            select: { name: true, avatar: true }
                        }
                    }
                }
            }
        });
    }

    async getOrCreateConversation({ customerId, providerId }: { customerId: number, providerId: number }) {
        const conversation = await this.prismaService.conversation.findFirst({
            where: { customerId, providerId },
        });

        if (conversation) return conversation;

        return this.prismaService.conversation.create({
            data: { customerId, providerId, updatedAt: new Date() },
        });
    }
    async getMessages(query: GetListMessageQueryType) {
        const skip = (query.page - 1) * query.limit;

        const [data, totalItems] = await Promise.all([
            this.prismaService.message.findMany({
                where: { conversationId: query.conversationId },
                orderBy: { sentAt: 'desc' },
                skip,
                take: query.limit,
            }),
            this.prismaService.message.count({ where: { conversationId: query.conversationId } }),
        ]);

        return {
            data,
            pagination: {
                page: query.page,
                limit: query.limit,
                totalItems,
                totalPages: Math.ceil(totalItems / query.limit),
            }
        };
    }
    async createMessage(senderId: number, role: string, body: CreateMessageBodyType) {

        const senderType = role === RoleName.ServiceProvider ? ChatSenderType.PROVIDER : ChatSenderType.CUSTOMER
        const message = await this.prismaService.message.create({
            data: { senderId, senderType: senderType, conversationId: body.conversationId, content: body.content, imageUrl: body.imageUrl },
        });

        await this.prismaService.conversation.update({
            where: { id: body.conversationId },
            data: {
                lastMessage: body.content,
                lastMessageAt: new Date(),
                unreadByCustomer: role === ChatSenderType.PROVIDER ? { increment: 1 } : undefined,
                unreadByProvider: role === ChatSenderType.CUSTOMER ? { increment: 1 } : undefined,
            },
        });

        return message;
    }
    async markMessagesAsRead(conversationId: number, role: string) {
        await this.prismaService.message.updateMany({
            where: {
                conversationId,
                isRead: false,
                senderType: role === 'CUSTOMER' ? 'PROVIDER' : 'CUSTOMER',
            },
            data: { isRead: true },
        });

        await this.prismaService.conversation.update({
            where: { id: conversationId },
            data: {
                unreadByCustomer: role === 'CUSTOMER' ? 0 : undefined,
                unreadByProvider: role === 'PROVIDER' ? 0 : undefined,
            },
        });
    }
    async isUserInConversation(conversationId: number) {
        const conversation = await this.prismaService.conversation.findUnique({
            where: { id: conversationId },
            select: {
                customerId: true,
                providerId: true
            },
        });
        return conversation
    }


}