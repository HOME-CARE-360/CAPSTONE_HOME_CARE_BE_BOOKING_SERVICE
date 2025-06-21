import {
    UnprocessableEntityException,
    BadRequestException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';



export const ServiceProviderAlreadyExistsException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.ServiceProviderAlreadyExists', path: ['taxId', 'name'] },
    ])
);

export const SameVerificationStatusException = new RpcException(
    new BadRequestException([
        { message: 'Error.SameVerificationStatus', path: ['verificationStatus'] },
    ])
);

export const InvalidCompanyTypeException = new RpcException(
    new BadRequestException([
        { message: 'Error.InvalidCompanyType', path: ['companyType'] },
    ])
);

export const UserAlreadyLinkedToProviderException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.UserAlreadyLinkedToProvider', path: ['userId'] },
    ])
);
