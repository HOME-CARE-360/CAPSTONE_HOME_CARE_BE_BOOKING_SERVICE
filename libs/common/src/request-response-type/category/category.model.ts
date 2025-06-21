import { z } from "zod";

import { OrderBy, SortBy } from "../../constants/others.constant";
import { CategorySchema } from "../../models/shared-category.model";

export const CreateCategoryBodySchema = CategorySchema.pick({
    logo: true,
    name: true,
    parentCategoryId: true,
})
export const UpdateCategoryQuerySchema = z.object({
    categoryId: z.coerce.number()
})
export const UpdateCategoryBodySchema = CategorySchema.omit({ id: true })
export const GetListCategoryResSchema = CategorySchema.pick({
    logo: true,
    name: true,
    parentCategoryId: true,
    id: true
})
export const GetListCategoryQuerySchema = z.object({
    name: z.string().optional(),
    orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Desc),
    sortBy: z.enum([SortBy.CreatedAt]).default(SortBy.CreatedAt),
})
export type CreateCategoryBodyType = z.infer<typeof CreateCategoryBodySchema>
export type UpdateCategoryQueryType = z.infer<typeof UpdateCategoryQuerySchema>
export type UpdateCategoryBodyType = z.infer<typeof UpdateCategoryBodySchema>
export type GetListCategoryQueryType = z.infer<typeof GetListCategoryQuerySchema>
export type GetListCategoryResType = z.infer<typeof GetListCategoryResSchema>
