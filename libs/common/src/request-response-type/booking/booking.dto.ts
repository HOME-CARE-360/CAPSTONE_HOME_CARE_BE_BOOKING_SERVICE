import { createZodDto } from "nestjs-zod";
import { CreateServiceRequestBodySchema } from "./booking.model";

export class CreateServiceRequestBodySchemaDTO extends createZodDto(CreateServiceRequestBodySchema) { }