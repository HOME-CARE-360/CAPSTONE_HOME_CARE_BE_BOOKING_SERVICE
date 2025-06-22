import { Controller, Inject } from "@nestjs/common";
import { BookingsService } from "./booking.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateServiceRequestBodyType } from "libs/common/src/request-response-type/booking/booking.model";
import { RawTcpClientService } from "libs/common/src/tcp/raw-tcp-client.service";
import { PAYMENT_SERVICE } from "libs/common/src/constants/service-name.constant";
import { handleZodError } from "libs/common/helpers";


@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService, @Inject(PAYMENT_SERVICE) private readonly paymentRawTcpClient: RawTcpClientService) { }
  @MessagePattern({ cmd: "create-service-request" })
  async createRequestService(@Payload() { body, userId }: { body: CreateServiceRequestBodyType, userId: number }) {
    console.log(body, userId);

    console.log("service is going");

    const booking = await this.bookingsService.createServiceRequest(body)
    try {
      console.log("hihi1");

      return await this.paymentRawTcpClient.send({
        type: 'CREATE_TRANSACTION', data: {
          bookingId: booking.id,
          amount: 100000,
          method: body.paymentMethod, userId
        }
      })
    } catch (error) {
      console.log(error);

      handleZodError(error)
    }
  }
}