import { Injectable } from '@nestjs/common';
import { InvalidCategoryIdException } from 'libs/common/src/errors/share-category.error';
import { ServiceProviderNotFoundException } from 'libs/common/src/errors/share-provider.error';

import { SharedProviderRepository } from 'libs/common/src/repositories/share-provider.repo';
import { SharedCategoryRepository } from 'libs/common/src/repositories/shared-category.repo';
import { CreateServiceRequestBodyType } from 'libs/common/src/request-response-type/booking/booking.model';
import { RabbitService } from 'libs/common/src/services/rabbit.service';

@Injectable()
export class BookingsService {
  constructor(

    private readonly sharedProviderRepository: SharedProviderRepository,
    private readonly bookingsRepository: BookingsService,
    private readonly sharedCategoriesRepository: SharedCategoryRepository,
    private readonly rabbit: RabbitService
  ) { }
  async createServiceRequest(body: CreateServiceRequestBodyType) {
    const [category, provider] = await Promise.all([this.sharedCategoriesRepository.findUnique([body.categoryId]), this.sharedProviderRepository.findUnique({ id: body.providerId })])
    if (category.length < 1) throw InvalidCategoryIdException([body.categoryId])
    if (!provider) throw ServiceProviderNotFoundException
    return await this.bookingsRepository.createServiceRequest(body)
  }

}
