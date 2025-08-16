import { Controller, Inject } from "@nestjs/common";
import { BookingsService } from "./booking.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateServiceRequestBodyType } from "libs/common/src/request-response-type/booking/booking.model";
import { RawTcpClientService } from "libs/common/src/tcp/raw-tcp-client.service";
import { PAYMENT_SERVICE } from "libs/common/src/constants/service-name.constant";
import { handleZodError } from "libs/common/helpers";
import { AccessTokenPayload } from "libs/common/src/types/jwt.type";
import { CreateMessageBodyType, GetListMessageQueryType } from "libs/common/src/request-response-type/chat/chat.model";
import { PaymentMethod } from "@prisma/client";


@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService, @Inject(PAYMENT_SERVICE) private readonly paymentRawTcpClient: RawTcpClientService) { }
  async createServiceRequest(
    body: CreateServiceRequestBodyType,
    customerId: number,
    userId: number,
  ) {
    // Lấy dữ liệu song song
    const [category, provider, wallet] = await Promise.all([
      this.sharedCategoriesRepository.findUnique([body.categoryId]),
      this.sharedProviderRepository.findUnique({ id: body.providerId }),
      this.sharedWidthDrawRepository.findWalletBalance(userId),
    ]);

    if (!category?.length) throw InvalidCategoryIdException([body.categoryId]);
    if (!provider) throw ServiceProviderNotFoundException;

    let debited = false;

    if (body.paymentMethod === PaymentMethod.WALLET) {
      if (!wallet?.Wallet) throw WalletNotFoundException;

      // TRÁNH RACE: trừ tiền nguyên tử, thất bại thì báo thiếu
      debited = await this.sharedWidthDrawRepository.debitIfSufficient(
        userId,
        MIN_BALANCE,
      );
      if (!debited) {
        throw BuildWalletBalanceInsufficientException(MIN_BALANCE);
      }
    }

    try {
      const serviceRequest = await this.bookingRepository.createServiceRequest(
        body,
        customerId,
      );

      await this.sharedBookingsRepository.create({
        customerId,
        providerId: body.providerId,
        status: BookingStatus.PENDING,
        serviceRequestId: serviceRequest.id,
      });

      return serviceRequest;
    } catch (err) {
      // Nếu đã trừ tiền ví mà lỗi bất kỳ → bù tiền ngay
      if (debited) {
        await this.sharedWidthDrawRepository
          .credit(userId, MIN_BALANCE)
          .catch(() => {
            // log lại tuỳ ý; tránh throw đè mất error gốc
          });
      }
      throw err;
    }
  }
  @MessagePattern({ cmd: "create-message" })
  async createMessage(@Payload() { user, body }: { user: AccessTokenPayload, body: CreateMessageBodyType }) {
    console.log("vo 1");

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