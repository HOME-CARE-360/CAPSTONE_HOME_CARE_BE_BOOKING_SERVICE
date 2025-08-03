import { Injectable } from "@nestjs/common";
import { RequestStatus } from "@prisma/client";
import { CancelBookingType, CreateServiceRequestBodyType } from "libs/common/src/request-response-type/booking/booking.model";
import { PrismaService } from "libs/common/src/services/prisma.service";



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


            }
        })
    }
    async cancelBooking(body: CancelBookingType) {
        return await this.prismaService.serviceRequest.update({
            where: {
                id: body.id
            }, data: {
                status: RequestStatus.REJECTED
            }
        })
    }

}