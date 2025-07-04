import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { CreateBookingBodyType } from "../request-response-type/booking/booking.model";

@Injectable()
export class SharedBookingRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async create(body: CreateBookingBodyType) {
        return await this.prismaService.booking.create({
            data: {
                ...body
            }
        })
    }

}