import { Injectable } from "@nestjs/common";
import { CreateServiceRequestBodyType } from "libs/common/src/request-response-type/booking/booking.model";
import { PrismaService } from "libs/common/src/services/prisma.service";



@Injectable()
export class BookingRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async createServiceRequest(body: CreateServiceRequestBodyType) {
        await this.prismaService.serviceRequest.create({
            data: {
                ...body
            }
        })
    }

}