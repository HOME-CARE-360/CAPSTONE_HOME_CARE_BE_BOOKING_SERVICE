import { BookingStatus } from '@prisma/client';
import { z } from 'zod';


export const BookingSchema = z.object({
    id: z.number(),
    customerId: z.number(),
    providerId: z.number(),
    status: z.nativeEnum(BookingStatus),
    deletedAt: z.date().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    staffId: z.number().nullable().optional(),
    serviceRequestId: z.number().nullable().optional(),
});

export type BookingType = z.infer<typeof BookingSchema>;
