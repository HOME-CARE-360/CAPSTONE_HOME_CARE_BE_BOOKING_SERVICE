import { NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const ServiceProviderNotFoundException = new RpcException(
    new NotFoundException([
        { message: 'Service provider not found', path: ['id'] },
    ]),
);

export const MissingProviderIdException = new RpcException(
    new BadRequestException([
        { message: 'Provider ID is missing', path: ['providerId'] },
    ]),
);

export const ProviderNotVerifiedException = new RpcException(
    new ForbiddenException([
        { message: 'Service provider has not been verified', path: ['providerId'] },
    ]),
);
