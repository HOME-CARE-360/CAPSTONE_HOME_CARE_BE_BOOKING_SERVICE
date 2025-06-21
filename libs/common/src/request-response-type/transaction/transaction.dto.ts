import { createZodDto } from "nestjs-zod";
import { CreateTransactionSchema } from "./transaction.model";

export class CreateTransactionDTO extends createZodDto(CreateTransactionSchema) { }