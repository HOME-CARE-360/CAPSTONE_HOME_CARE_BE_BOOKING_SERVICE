import { NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export const StaffNotFoundOrNotBelongToProviderException = new RpcException(
    new NotFoundException([
        {
            message: 'Staff not found or does not belong to this provider',
            path: ['staffId'],
        },
    ]),
);
