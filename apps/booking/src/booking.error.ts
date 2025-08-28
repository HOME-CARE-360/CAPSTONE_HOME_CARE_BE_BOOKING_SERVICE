import { UnprocessableEntityException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export const ServiceRequestNotFoundException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Service request not found', path: ['id'] },
    ]),
);

export const CustomerNotFoundException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Customer not found', path: ['id'] },
    ]),
);

export const ServiceRequestInvalidStatusException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Invalid service request status (must not be in progress)', path: ['status'] },
    ]),
);

export const BookingNotFoundOrNotBelongToProviderException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Booking not found or does not belong to this provider', path: ['bookingId'] },
    ]),
);

export const UserInvalidRoleException = new RpcException(
    new UnprocessableEntityException([
        { message: 'User must be either a customer or a provider', path: ['user'] },
    ]),
);

export const BuildWalletBalanceInsufficientException = (min: number) =>
    new RpcException(
        new UnprocessableEntityException([
            { message: `Wallet balance is insufficient. Minimum required: ${min}`, path: ['wallet', 'balance'], meta: { min } },
        ]),
    );
