import { createZodDto } from "nestjs-zod";
import { CreateCategoryBodySchema, GetListCategoryQuerySchema, GetListCategoryResSchema, UpdateCategoryBodySchema, UpdateCategoryQuerySchema } from "./category.model";

export class CreateCategoryBodyDTO extends createZodDto(CreateCategoryBodySchema) { }
export class GetListCategoryQueryDTO extends createZodDto(GetListCategoryQuerySchema) { }
export class GetListCategoryResDTO extends createZodDto(GetListCategoryResSchema) { }
export class UpdateCategoryBodyDTO extends createZodDto(UpdateCategoryBodySchema) { }
export class UpdateCategoryQueryDTO extends createZodDto(UpdateCategoryQuerySchema) { }