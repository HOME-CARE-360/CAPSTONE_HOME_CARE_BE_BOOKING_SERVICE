import { BadRequestException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export function InvalidCategoryIdException(invalidIds: number[]) {
    return new RpcException(
        new BadRequestException([
            {
                message: `Invalid category ID(s): ${invalidIds.join(", ")}`,
                path: ['categoryRequirements'],
                meta: { invalidIds },
            },
        ]),
    );
}

export function CategoryAlreadyExistException(invalidNames: string[]) {
    return new RpcException(
        new BadRequestException([
            {
                message: `Category already exists with name(s): ${invalidNames.join(", ")}`,
                path: ['name'],
                meta: { invalidNames },
            },
        ]),
    );
}
