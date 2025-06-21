import { Controller, Inject, Post } from "@nestjs/common";
import { BookingsService } from "./booking.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateServiceRequestBodyType } from "libs/common/src/request-response-type/booking/booking.model";
import { RawTcpClientService } from "libs/common/src/tcp/raw-tcp-client.service";
import { USER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { handleZodError } from "libs/common/helpers";


@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService, @Inject(USER_SERVICE) private readonly userRawTcpClient: RawTcpClientService) { }
  // @MessagePattern({ cmd: "create-request-service" })
  @Post("create-request-service")
  async createRequestService(@Payload() { body, userId }: { body: CreateServiceRequestBodyType, userId: number }) {

    const booking = await this.bookingsService.createServiceRequest(body)
    try {
      return await this.userRawTcpClient.send({
        type: 'CREATE_TRANSACTION', data: {
          bookingId: booking.id,
          amount: 100000,
          method: body.paymentMethod, userId
        }
      })
    } catch (error) {
      handleZodError(error)
    }
  }
}