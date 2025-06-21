import { z } from "zod";
import { ServiceRequestSchema } from "../../models/shared-service-request.model";

export const CreateServiceRequestBodySchema = ServiceRequestSchema.omit({
    updatedAt: true,
    createdAt: true,
    status: true,
    id: true
}).strict()
export type CreateServiceRequestBodyType = z.infer<typeof CreateServiceRequestBodySchema>