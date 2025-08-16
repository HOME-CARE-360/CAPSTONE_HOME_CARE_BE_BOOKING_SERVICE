import { z } from "zod";
import { ServiceRequestSchema } from "../../models/shared-service-request.model";
import { BookingSchema } from "../../models/shared-booking.model";
import { PaymentMethod } from "@prisma/client";

export const CreateServiceRequestBodySchema = ServiceRequestSchema.omit({
    updatedAt: true,
    createdAt: true,
    status: true,
    id: true, customerId: true
}).extend({
    paymentMethod: z.enum([PaymentMethod.BANK_TRANSFER, PaymentMethod.WALLET])
}).strict()
export const CancelBookingSchema = ServiceRequestSchema.pick({
    id: true
}).strict()
export const CreateBookingBodySchema = BookingSchema.omit({
    updatedAt: true,
    createdAt: true,
    id: true
}).strict()
export type CancelBookingType = z.infer<typeof CancelBookingSchema>
export type CreateServiceRequestBodyType = z.infer<typeof CreateServiceRequestBodySchema>
export type CreateBookingBodyType = z.infer<typeof CreateBookingBodySchema>