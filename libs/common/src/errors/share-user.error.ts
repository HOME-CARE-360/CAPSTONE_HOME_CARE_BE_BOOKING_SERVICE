import { NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export const UserNotFoundException = new RpcException(
    new NotFoundException([
        {
            message: 'User not found',
            path: ['code'],
        },
    ]),
);
