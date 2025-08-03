import {
    UnprocessableEntityException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';



export const ServiceRequestNotFoundException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.ServiceRequestNotFound', path: ['id'] },
    ])
);

export const ServiceRequestInvalidStatusException = new RpcException(
    new UnprocessableEntityException([
        {
            message: 'Error.ServiceRequestInProgress',
            path: ['status'],
        },
    ])
);