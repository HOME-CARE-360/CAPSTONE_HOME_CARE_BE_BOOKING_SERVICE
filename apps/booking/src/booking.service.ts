import { Injectable } from '@nestjs/common';
import { BookingStatus, RequestStatus } from '@prisma/client';
import { InvalidCategoryIdException } from 'libs/common/src/errors/share-category.error';
import { ServiceProviderNotFoundException } from 'libs/common/src/errors/share-provider.error';

import { SharedProviderRepository } from 'libs/common/src/repositories/share-provider.repo';
import { SharedBookingRepository } from 'libs/common/src/repositories/shared-booking.repo';
import { SharedCategoryRepository } from 'libs/common/src/repositories/shared-category.repo';
import { CancelBookingType, CreateServiceRequestBodyType } from 'libs/common/src/request-response-type/booking/booking.model';
import { RabbitService } from 'libs/common/src/services/rabbit.service';
import { BookingRepository } from './booking.repo';
import { BookingNotFoundOrNotBelongToProviderException, ServiceRequestInvalidStatusException, ServiceRequestNotFoundException, UserInvalidRoleException } from './booking.error';
import { AccessTokenPayload } from 'libs/common/src/types/jwt.type';
import { CreateMessageBodyType, GetListMessageQueryType } from 'libs/common/src/request-response-type/chat/chat.model';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly sharedProviderRepository: SharedProviderRepository,
    private readonly sharedCategoriesRepository: SharedCategoryRepository,
    private readonly sharedBookingsRepository: SharedBookingRepository,
    private readonly rabbit: RabbitService,

  ) { }
  async createServiceRequest(body: CreateServiceRequestBodyType, customerId: number) {


    const [category, provider] = await Promise.all([this.sharedCategoriesRepository.findUnique([body.categoryId]), this.sharedProviderRepository.findUnique({ id: body.providerId })])
    if (category.length < 1) throw InvalidCategoryIdException([body.categoryId])
    if (!provider) throw ServiceProviderNotFoundException
    const serviceRequest = await this.bookingRepository.createServiceRequest(body, customerId)
    await this.sharedBookingsRepository.create({
      customerId: customerId,
      providerId: body.providerId,
      status: BookingStatus.PENDING,
      serviceRequestId: serviceRequest.id,



    })
    return serviceRequest
  }
  async cancelBooking(body: CancelBookingType, providerId: number) {
    const serviceRequest = await this.sharedBookingsRepository.findUniqueServiceRequest(body.id)

    if (!serviceRequest) {
      throw ServiceRequestNotFoundException
    } else {
      if (serviceRequest.status !== RequestStatus.PENDING) throw ServiceRequestInvalidStatusException
      if (serviceRequest.providerId !== providerId) throw BookingNotFoundOrNotBelongToProviderException
    }

  }
  async getUserConversations(user: AccessTokenPayload) {
    if (!user.customerId && !user.providerId) throw UserInvalidRoleException
    return await this.bookingRepository.getUserConversations(user)
  }
  async getOrCreateConversation(user: AccessTokenPayload, receiverId: number) {
    const providerId = user.providerId ? user.providerId : receiverId
    const customerId = user.customerId ? user.customerId : receiverId
    return await this.bookingRepository.getOrCreateConversation({ customerId, providerId })
  }
  async getMessages(query: GetListMessageQueryType) {
    return await this.bookingRepository.getMessages(query)
  }
  async createMessage(body: CreateMessageBodyType, user: AccessTokenPayload) {

    const senderType = user.roles[0].name
    return await this.bookingRepository.createMessage(user.userId, senderType, body)
  }
  async markMessagesAsRead(conversationId: number, user: AccessTokenPayload) {
    const senderType = user.roles[0].name
    return await this.bookingRepository.markMessagesAsRead(conversationId, senderType)
  }
  async isUserInConversation(conversationId: number, user: AccessTokenPayload): Promise<boolean> {

    const conversation = await this.bookingRepository.isUserInConversation(conversationId)
    if (!conversation) return false;

    if (user.roles[0].name === 'CUSTOMER') {
      return conversation.customerId === user.customerId;
    } else if (user.roles[0].name === 'SERVICE PROVIDER') {
      return conversation.providerId === user.providerId;
    }

    return false;
  }
}
