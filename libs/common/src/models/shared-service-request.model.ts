import { z } from 'zod'
import { RequestStatusConst } from '../constants/common.constants'

export const ServiceRequestSchema = z.object({
    id: z.number(),
    customerId: z.number(),
    providerId: z.number(),
    note: z.string().nullable().optional(),
    preferredDate: z.date(),
    location: z.string().max(500),
    categoryId: z.number(),
    status: z.enum([RequestStatusConst.BOOKED, RequestStatusConst.ESTIMATED, RequestStatusConst.IN_PROGRESS, RequestStatusConst.REJECTED, RequestStatusConst.PENDING]),
    createdAt: z.date(),
    updatedAt: z.date(),
    phoneNumber: z.string(),
})

export type ServiceRequestType = z.infer<typeof ServiceRequestSchema>
