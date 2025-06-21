import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const CreateTransactionSchema = z.object({
    bookingId: z.number(),
    amount: z.number().positive(),
    method: z.nativeEnum(PaymentMethod),
    userId: z.number()
});
export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;