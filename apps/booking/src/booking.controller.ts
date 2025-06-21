import { Controller } from "@nestjs/common";
import { BookingsService } from "./booking.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateServiceRequestBodyType } from "libs/common/src/request-response-type/booking/booking.model";


@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }
  @MessagePattern({ cmd: "create-request-service" })
  async createRequestService(@Payload() body: CreateServiceRequestBodyType) {
    return await this.bookingsService.createServiceRequest(body)

  }
}