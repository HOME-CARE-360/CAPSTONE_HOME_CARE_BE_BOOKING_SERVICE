import { BookingStatus, InspectionStatus } from '@prisma/client';
import { z } from 'zod';


export const BookingSchema = z.object({
    id: z.number(),
    customerId: z.number(),
    providerId: z.number(),
    status: z.nativeEnum(BookingStatus),
    deletedAt: z.date().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    inspectedAt: z.date().nullable().optional(),
    inspectedById: z.number().nullable().optional(),
    inspectionNote: z.string().nullable().optional(),
    inspectionStatus: z.nativeEnum(InspectionStatus),
    staffId: z.number().nullable().optional(),
    serviceRequestId: z.number().nullable().optional(),
});

export type BookingType = z.infer<typeof BookingSchema>;
