import { Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { InvalidCategoryIdException } from 'libs/common/src/errors/share-category.error';
import { ServiceProviderNotFoundException } from 'libs/common/src/errors/share-provider.error';

import { SharedProviderRepository } from 'libs/common/src/repositories/share-provider.repo';
import { SharedBookingRepository } from 'libs/common/src/repositories/shared-booking.repo';
import { SharedCategoryRepository } from 'libs/common/src/repositories/shared-category.repo';
import { CreateServiceRequestBodyType } from 'libs/common/src/request-response-type/booking/booking.model';
import { RabbitService } from 'libs/common/src/services/rabbit.service';
import { BookingRepository } from './booking.repo';

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
    return this.sharedBookingsRepository.create({
      customerId: customerId,
      providerId: body.providerId,
      status: BookingStatus.PENDING,
      serviceRequestId: serviceRequest.id,



    })
  }

}
