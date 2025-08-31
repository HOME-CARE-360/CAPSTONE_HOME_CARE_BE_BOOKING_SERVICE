import { Controller, Inject } from "@nestjs/common";
import { BookingsService } from "./booking.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateServiceRequestBodyType } from "libs/common/src/request-response-type/booking/booking.model";
import { RawTcpClientService } from "libs/common/src/tcp/raw-tcp-client.service";
import { PAYMENT_SERVICE } from "libs/common/src/constants/service-name.constant";
import { handleZodError } from "libs/common/helpers";
import { AccessTokenPayload } from "libs/common/src/types/jwt.type";
import { CreateMessageBodyType, GetListMessageQueryType } from "libs/common/src/request-response-type/chat/chat.model";
import { PrismaService } from "libs/common/src/services/prisma.service";


@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService, @Inject(PAYMENT_SERVICE) private readonly paymentRawTcpClient: RawTcpClientService, private readonly prismaService: PrismaService) { }
  @MessagePattern({ cmd: "create-service-request" })
  // @Post("create-service-request")
  async createRequestService(@Payload() { body, customerID, userId }: { body: CreateServiceRequestBodyType, customerID: number, userId: number }) {
    const [serviceRequest, sys] = await Promise.all([this.bookingsService.createServiceRequest(body, customerID), this.prismaService.systemConfig.findFirst({
      where: {
        key: "BOOKING_DEPOSIT"
      }
    })])
    try {

      return await this.paymentRawTcpClient.send({
        type: 'CREATE_TRANSACTION', data: {
          serviceRequestId: serviceRequest.id,
          amount: sys?.value,
          paymentMethod: body.paymentMethod, userId
        }
      })

    } catch (error) {
      handleZodError(error)
    }

  }
  @MessagePattern({ cmd: "create-message" })
  async createMessage(@Payload() { user, body }: { user: AccessTokenPayload, body: CreateMessageBodyType }) {
    return await this.bookingsService.createMessage(body, user)
  }
  @MessagePattern({ cmd: "get-user-conversation" })
  async getUserConversations(@Payload() { user }: { user: AccessTokenPayload }) {
    return await this.bookingsService.getUserConversations(user)
  }

  @MessagePattern({ cmd: "get-messages" })
  async getMessages(@Payload() { query }: { query: GetListMessageQueryType }) {
    return await this.bookingsService.getMessages(query)
  }
  @MessagePattern({ cmd: "get-or-create-conversation" })
  async getOrCreateConversation(@Payload() { user, receiverId }: { user: AccessTokenPayload, receiverId: number }) {
    return await this.bookingsService.getOrCreateConversation(user, receiverId)
  }
  @MessagePattern({ cmd: "mark-messages-as-read" })

  async markMessagesAsRead(@Payload() { user, conversationId }: { user: AccessTokenPayload, conversationId: number }) {
    return await this.bookingsService.markMessagesAsRead(conversationId, user)
  }
  @MessagePattern({ cmd: 'check-conversation-participant' })
  async checkParticipant(
    @Payload() payload: { user: AccessTokenPayload; conversationId: number }
  ): Promise<boolean> {
    const { user, conversationId } = payload;
    return this.bookingsService.isUserInConversation(conversationId, user);
  }

}