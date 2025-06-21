import { NotFoundException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const ServiceProviderNotFoundException = new RpcException(
    new NotFoundException([
        { message: 'Error.ServiceProviderNotFound', path: ['id'] },
    ])
);

export const MissingProviderIdException = new RpcException({
    message: 'Error.MissingProviderId',
    path: ['providerId'],
});

export const ProviderNotVerifiedException = new RpcException({
    message: 'Error.ProviderNotVerified',
    path: ['providerId'],
});
