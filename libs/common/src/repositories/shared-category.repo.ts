import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { CreateCategoryBodyType, GetListCategoryQueryType, UpdateCategoryBodyType } from "../request-response-type/category/category.model";
import { Prisma } from "@prisma/client";

@Injectable()
export class SharedCategoryRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async findUnique(categoryIds: number[]) {
        return await this.prismaService.category.findMany({
            where: {
                id: { in: categoryIds },
                deletedAt: null
            },
            select: { id: true }
        });
    }
    async findUniqueName(categoryNames: string[]) {
        return await this.prismaService.category.findMany({
            where: {
                name: { in: categoryNames },
                deletedAt: null
            },
            select: { id: true }
        });
    }
    async findAllCategory(query: GetListCategoryQueryType) {
        const where: Prisma.CategoryWhereInput = {
            deletedAt: null
        }
        if (query.name) {
            where.name = query.name
        }
        const categories = await this.prismaService.category.findMany({
            where,
            select: {
                id: true, logo: true, name: true, parentCategory: {
                    select: {
                        name: true,
                        id: true,
                        logo: true
                    }
                }
            }, orderBy: {
                [query.sortBy]: query.orderBy
            }
        });
        return categories

    }
    async createCategory(body: CreateCategoryBodyType, userId: number) {
        return await this.prismaService.category.create({
            data: {
                ...body,
                createdById: userId

            }
        })



    }
    async updateCategory(body: UpdateCategoryBodyType, userId: number, categoryId: number) {
        return await this.prismaService.category.update({
            where: {
                id: categoryId
            },
            data: {
                ...body,
                updatedById: userId
            }

        })
    }
    async deleteCategory(userId: number, categoryId: number) {
        return await this.prismaService.category.update({
            where: {
                id: categoryId
            },
            data: {
                deletedAt: new Date(),
                createdById: userId
            }

        })
    }

}