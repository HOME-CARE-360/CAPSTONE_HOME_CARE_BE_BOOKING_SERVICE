import { createZodDto } from "nestjs-zod";
import { CreateServiceRequestBodySchema, CancelBookingSchema } from "./booking.model";

export class CreateServiceRequestBodySchemaDTO extends createZodDto(CreateServiceRequestBodySchema) { }
export class CancelBookingSchemaDTO extends createZodDto(CancelBookingSchema) { }

